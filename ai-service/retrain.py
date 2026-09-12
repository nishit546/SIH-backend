import os
import sys
import logging
import inspect
import numpy as np
import pandas as pd
import torch

from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    DataCollatorWithPadding,
)

# ---------------------------------------------------------------------------
# Logging Configuration
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("sih-retrain-oil")

# ---------------------------------------------------------------------------
# Constants & Hyperparameters
# ---------------------------------------------------------------------------
DATASET_PATH = "dataset/OIL_HSE_SIF_Dataset_10k.csv"
MODEL_DIR = "./sif_final_model"
OUTPUT_DIR = "./sif_model_upgraded"
SAMPLES_PER_CLASS = 1500
RANDOM_STATE = 42
MAX_LENGTH = 128
NUM_EPOCHS = 3
LEARNING_RATE = 2e-5
BATCH_SIZE = 8

# ---------------------------------------------------------------------------
# Data Ingestion, Cleaning & Balancing
# ---------------------------------------------------------------------------
def ingest_and_balance_dataset(csv_path: str, samples_per_class: int = 1500) -> Dataset:
    logger.info(f"Loading OIL HSE dataset from '{csv_path}'...")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at expected path: {csv_path}")

    df = pd.read_csv(csv_path, low_memory=False, on_bad_lines="skip")
    logger.info(f"Successfully loaded {len(df):,} raw records from {csv_path}.")

    # Validate required columns
    text_col = "Description / Report Text"
    target_col = "SIF Potential"

    if text_col not in df.columns:
        raise KeyError(f"Missing required text column '{text_col}'. Columns present: {list(df.columns)}")
    if target_col not in df.columns:
        raise KeyError(f"Missing required target column '{target_col}'. Columns present: {list(df.columns)}")

    # Rename text column
    df = df.rename(columns={text_col: "text"})

    # Map target string values to binary integer labels: Yes -> 1, No -> 0
    label_map = {"yes": 1, "no": 0}
    df["label"] = df[target_col].astype(str).str.strip().str.lower().map(label_map)

    # Drop NaNs and filter out short/trivial descriptions (< 15 characters)
    initial_count = len(df)
    df = df.dropna(subset=["text", "label"]).copy()
    df["text"] = df["text"].astype(str).str.strip()
    df = df[df["text"].str.len() >= 15]
    df["label"] = df["label"].astype(int)

    logger.info(f"Cleaned dataset: {len(df):,} valid rows retained (dropped {initial_count - len(df):,} invalid/short rows).")
    logger.info(f"Class distribution before sampling: {df['label'].value_counts().to_dict()}")

    # Separate classes
    high_risk_df = df[df["label"] == 1]
    low_risk_df = df[df["label"] == 0]

    if len(high_risk_df) < samples_per_class:
        raise ValueError(f"Insufficient High Risk (label=1) samples: found {len(high_risk_df)}, need {samples_per_class}.")
    if len(low_risk_df) < samples_per_class:
        raise ValueError(f"Insufficient Low Risk (label=0) samples: found {len(low_risk_df)}, need {samples_per_class}.")

    # Extract exactly balanced random subsets
    sampled_high = high_risk_df.sample(n=samples_per_class, random_state=RANDOM_STATE)
    sampled_low = low_risk_df.sample(n=samples_per_class, random_state=RANDOM_STATE)

    # Concatenate and shuffle thoroughly
    balanced_df = pd.concat([sampled_high, sampled_low], ignore_index=True)
    balanced_df = balanced_df.sample(frac=1.0, random_state=RANDOM_STATE).reset_index(drop=True)

    logger.info(f"Created balanced training dataset with {len(balanced_df):,} total samples.")
    logger.info(f"Balanced distribution: {balanced_df['label'].value_counts().to_dict()}")

    # Convert to Hugging Face Dataset and perform 90/10 train/test split
    hf_dataset = Dataset.from_pandas(balanced_df[["text", "label"]])
    dataset_splits = hf_dataset.train_test_split(test_size=0.1, seed=RANDOM_STATE)

    logger.info(f"Train split: {len(dataset_splits['train']):,} rows (90%)")
    logger.info(f"Test split : {len(dataset_splits['test']):,} rows (10%)")
    return dataset_splits

# ---------------------------------------------------------------------------
# Evaluation Metrics (Accuracy & Weighted F1)
# ---------------------------------------------------------------------------
def build_compute_metrics():
    try:
        import evaluate
        accuracy_metric = evaluate.load("accuracy")
        f1_metric = evaluate.load("f1")

        def compute_metrics(eval_pred):
            logits, labels = eval_pred
            predictions = np.argmax(logits, axis=-1)
            acc = accuracy_metric.compute(predictions=predictions, references=labels)["accuracy"]
            f1 = f1_metric.compute(predictions=predictions, references=labels, average="weighted")["f1"]
            return {"accuracy": round(float(acc), 4), "f1": round(float(f1), 4)}

        logger.info("Evaluation configured using 'evaluate' library.")
        return compute_metrics
    except Exception as e:
        logger.warning(f"Falling back to scikit-learn for metrics: {e}")
        from sklearn.metrics import accuracy_score, f1_score

        def compute_metrics(eval_pred):
            logits, labels = eval_pred
            predictions = np.argmax(logits, axis=-1)
            acc = accuracy_score(labels, predictions)
            f1 = f1_score(labels, predictions, average="weighted")
            return {"accuracy": round(float(acc), 4), "f1": round(float(f1), 4)}

        return compute_metrics

# ---------------------------------------------------------------------------
# Main Execution Pipeline
# ---------------------------------------------------------------------------
def main():
    logger.info("=" * 80)
    logger.info("  OIL INDIA LIMITED - SIF DISTILBERT RETRAINING PIPELINE (10K HSE)")
    logger.info("=" * 80)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info(f"Compute device selected: {device.upper()}")

    # 1. Ingest, Clean, Balance & Split Dataset
    dataset_splits = ingest_and_balance_dataset(DATASET_PATH, samples_per_class=SAMPLES_PER_CLASS)

    # 2. Load Existing Tokenizer and DistilBERT Model
    logger.info(f"Loading existing model and tokenizer from '{MODEL_DIR}'...")
    if not os.path.exists(MODEL_DIR):
        raise FileNotFoundError(f"Model directory '{MODEL_DIR}' does not exist.")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR, num_labels=2)
    model.to(device)

    # 3. Tokenize Dataset (max_length=128, padding='max_length', truncation=True)
    def tokenize_function(batch):
        return tokenizer(
            batch["text"],
            padding="max_length",
            truncation=True,
            max_length=MAX_LENGTH,
        )

    logger.info(f"Tokenizing dataset splits with max_length={MAX_LENGTH}...")
    tokenized_datasets = dataset_splits.map(tokenize_function, batched=True)

    # 4. Configure Training Arguments
    training_kwargs = {
        "output_dir": OUTPUT_DIR,
        "num_train_epochs": NUM_EPOCHS,
        "learning_rate": LEARNING_RATE,
        "per_device_train_batch_size": BATCH_SIZE,
        "per_device_eval_batch_size": BATCH_SIZE,
        "save_strategy": "no",            # Save disk space during training
        "logging_steps": 25,
        "fp16": torch.cuda.is_available(),
        "load_best_model_at_end": False,
        "report_to": "none",
    }

    try:
        training_args = TrainingArguments(eval_strategy="epoch", **training_kwargs)
    except TypeError:
        training_args = TrainingArguments(evaluation_strategy="epoch", **training_kwargs)

    # 5. Initialize Trainer
    compute_metrics_fn = build_compute_metrics()
    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

    trainer_kwargs = {
        "model": model,
        "args": training_args,
        "train_dataset": tokenized_datasets["train"],
        "eval_dataset": tokenized_datasets["test"],
        "data_collator": data_collator,
        "compute_metrics": compute_metrics_fn,
    }
    if "processing_class" in inspect.signature(Trainer.__init__).parameters:
        trainer_kwargs["processing_class"] = tokenizer
    else:
        trainer_kwargs["tokenizer"] = tokenizer

    trainer = Trainer(**trainer_kwargs)

    # 6. Execute Training Loop
    logger.info(f"Beginning fine-tuning ({NUM_EPOCHS} epochs, lr={LEARNING_RATE}, batch_size={BATCH_SIZE})...")
    train_result = trainer.train()
    logger.info(f"Training completed successfully. Global Metrics: {train_result.metrics}")

    # 7. Evaluate on Held-Out Validation Split
    logger.info("Executing final evaluation on held-out test split (300 samples)...")
    eval_metrics = trainer.evaluate()
    logger.info(f"Final Validation Metrics: {eval_metrics}")

    # 8. Overwrite Existing Weights in ./sif_final_model
    logger.info(f"Overwriting and saving retrained model directly into '{MODEL_DIR}'...")
    trainer.save_model(MODEL_DIR)
    tokenizer.save_pretrained(MODEL_DIR)

    logger.info("=" * 80)
    logger.info(f"[SUCCESS] Upgraded model weights and tokenizer saved directly to '{MODEL_DIR}'.")
    logger.info("=" * 80)

if __name__ == "__main__":
    main()
