const express = require('express');
const asyncHandler = require('express-async-handler');
const documentController = require('../app/controllers/documentController');

const router = express.Router();

// Tambah dokumen baru
router.post('/documents', asyncHandler(documentController.addDocument));

// Ambil semua dokumen
router.get('/documents', asyncHandler(documentController.getDocuments));
router.get('/documents-pagination', asyncHandler(documentController.getDocumentsPagination));

// Update dokumen
router.put('/documents/:id', asyncHandler(documentController.updateDocument));

// Hapus dokumen
router.delete('/documents/:id', asyncHandler(documentController.deleteDocument));

module.exports = router;
