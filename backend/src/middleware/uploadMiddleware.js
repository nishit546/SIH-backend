const multer = require('multer');
const { AppError } = require('../utils/errors');

// Use in-memory storage so we don't write temporary files to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check MIME type or filename extension
  if (
    file.mimetype === 'application/pdf' ||
    file.originalname.toLowerCase().endsWith('.pdf')
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid file type. Only PDF documents (.pdf) are permitted.',
        400,
        'INVALID_FILE_TYPE'
      ),
      false
    );
  }
};

const audioFileFilter = (req, file, cb) => {
  const allowedExts = ['.wav', '.m4a', '.mp3', '.aac', '.ogg', '.webm', '.3gp', '.caf', '.flac', '.mp4'];
  const isAudioMime = file.mimetype && (file.mimetype.startsWith('audio/') || file.mimetype === 'video/mp4');
  const lowerName = (file.originalname || '').toLowerCase();
  const hasAudioExt = allowedExts.some((ext) => lowerName.endsWith(ext));

  if (isAudioMime || hasAudioExt) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid file type. Only audio recordings (.m4a, .wav, .mp3, .aac, .ogg, .webm) are permitted.',
        400,
        'INVALID_AUDIO_TYPE'
      ),
      false
    );
  }
};

const imageFileFilter = (req, file, cb) => {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.heic'];
  const isImageMime = file.mimetype && file.mimetype.startsWith('image/');
  const lowerName = (file.originalname || '').toLowerCase();
  const hasImageExt = allowedExts.some((ext) => lowerName.endsWith(ext));

  if (isImageMime || hasImageExt) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid file type. Only image files (.jpg, .jpeg, .png, .webp) are permitted.',
        400,
        'INVALID_IMAGE_TYPE'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB limit
  },
  fileFilter,
});

const uploadAudio = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB limit
  },
  fileFilter: audioFileFilter,
});

const uploadImage = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB limit
  },
  fileFilter: imageFileFilter,
});

module.exports = {
  uploadPdf: upload.single('pdf'),
  uploadAudio: uploadAudio.single('audio'),
  uploadImage: uploadImage.single('image'),
};
