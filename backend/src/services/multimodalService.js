const { aiConfig } = require('../config/aiConfig');
const { AppError } = require('../utils/errors');

class MultimodalService {
  constructor(serviceUrl = aiConfig.serviceUrl, timeoutMs = aiConfig.timeoutMs) {
    this.serviceUrl = serviceUrl;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Transcribe audio buffer using Python Whisper base model
   * @param {Buffer} fileBuffer Raw audio buffer from multer
   * @param {string} originalname Original filename or default audio.m4a
   * @param {string|null} languageHint Optional language hint ('en' | 'hi' | 'gu')
   */
  async transcribeAudio(fileBuffer, originalname = 'audio.m4a', languageHint = null) {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new AppError('Audio recording buffer cannot be empty', 400, 'EMPTY_AUDIO_BUFFER');
    }

    const endpoint = `${this.serviceUrl}/api/multimodal/transcribe`;
    console.log(`[Multimodal Service] Sending audio (${fileBuffer.length} bytes) to ${endpoint}`);

    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: 'audio/m4a' });
    formData.append('audio', blob, originalname);

    if (languageHint) {
      formData.append('language_hint', languageHint);
    }

    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs * 2);

      response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (networkError) {
      if (networkError.name === 'AbortError' || networkError.code === 'ABORT_ERR') {
        throw new AppError('Audio transcription request timed out', 504, 'STT_SERVICE_TIMEOUT');
      }
      console.error('[Multimodal Service] Connection error:', networkError.message);
      throw new AppError('Speech transcription service is currently unavailable', 503, 'STT_SERVICE_UNAVAILABLE');
    }

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || errJson.message || '';
      } catch {
        errorDetail = await response.text().catch(() => '');
      }
      console.error(`[Multimodal Service] STT error HTTP ${response.status}:`, errorDetail);
      throw new AppError(
        errorDetail || `Audio transcription service failed with status ${response.status}`,
        response.status >= 500 ? 502 : 400,
        'STT_PROCESSING_FAILED'
      );
    }

    const rawJson = await response.json();
    return rawJson.data || rawJson;
  }

  /**
   * Extract text from document image using OpenCV preprocessing and Tesseract OCR
   * @param {Buffer} fileBuffer Raw image buffer from multer
   * @param {string} originalname Original filename or default document.jpg
   */
  async extractImageOcr(fileBuffer, originalname = 'document.jpg') {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new AppError('Document image buffer cannot be empty', 400, 'EMPTY_IMAGE_BUFFER');
    }

    const endpoint = `${this.serviceUrl}/api/multimodal/ocr`;
    console.log(`[Multimodal Service] Sending image (${fileBuffer.length} bytes) to ${endpoint}`);

    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    formData.append('image', blob, originalname);

    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs * 2);

      response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (networkError) {
      if (networkError.name === 'AbortError' || networkError.code === 'ABORT_ERR') {
        throw new AppError('Document OCR extraction request timed out', 504, 'OCR_SERVICE_TIMEOUT');
      }
      console.error('[Multimodal Service] Connection error:', networkError.message);
      throw new AppError('Document OCR service is currently unavailable', 503, 'OCR_SERVICE_UNAVAILABLE');
    }

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || errJson.message || '';
      } catch {
        errorDetail = await response.text().catch(() => '');
      }
      console.error(`[Multimodal Service] OCR error HTTP ${response.status}:`, errorDetail);
      throw new AppError(
        errorDetail || `Document OCR extraction failed with status ${response.status}`,
        response.status >= 500 ? 502 : 400,
        'OCR_PROCESSING_FAILED'
      );
    }

    const rawJson = await response.json();
    return rawJson.data || rawJson;
  }

  /**
   * Translates safety text with negation preservation
   * @param {string} text Text narrative to translate
   * @param {string} sourceLang Source language code (auto, hi, gu)
   * @param {string} targetLang Target language code (en)
   */
  async translateText(text, sourceLang = 'auto', targetLang = 'en') {
    if (!text || !text.trim()) {
      throw new AppError('Text to translate cannot be empty', 400, 'EMPTY_TRANSLATION_TEXT');
    }

    const endpoint = `${this.serviceUrl}/api/multimodal/translate`;
    console.log(`[Multimodal Service] Sending translation request to ${endpoint}`);

    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          source_lang: sourceLang,
          target_lang: targetLang,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (networkError) {
      if (networkError.name === 'AbortError' || networkError.code === 'ABORT_ERR') {
        throw new AppError('Translation request timed out', 504, 'TRANSLATION_TIMEOUT');
      }
      throw new AppError('Translation service is currently unavailable', 503, 'TRANSLATION_UNAVAILABLE');
    }

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || errJson.message || '';
      } catch {
        errorDetail = await response.text().catch(() => '');
      }
      throw new AppError(
        errorDetail || `Translation failed with status ${response.status}`,
        response.status >= 500 ? 502 : 400,
        'TRANSLATION_FAILED'
      );
    }

    const rawJson = await response.json();
    return rawJson.data || rawJson;
  }
}

const multimodalService = new MultimodalService();

module.exports = {
  MultimodalService,
  multimodalService,
};
