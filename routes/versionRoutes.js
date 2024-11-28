const express = require('express');
const multer = require('multer');
const asyncHandler = require('express-async-handler');
const versionController = require('../app/controllers/versionController');

const router = express.Router();

// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Tambah versi dokumen
router.post(
  '/documents/:id/versions',
  upload.single('file'),
  asyncHandler(versionController.addDocumentVersion)
);

// Ambil semua versi dokumen berdasarkan id dokumen
router.get(
  '/documents/:id/versions',
  asyncHandler(versionController.getDocumentVersions)
);

// Hapus versi dokumen berdasarkan id versi
router.delete(
   '/documents/:id/versions/:versionId',
   asyncHandler(versionController.deleteDocumentVersion)
 );

module.exports = router;
