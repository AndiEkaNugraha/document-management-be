const documentApi = require('../api');

// Tambah dokumen baru
const addDocument = async (req, res) => {
  const id = await documentApi.addDocument(req.body);
  res.status(201).json({ id });
};

// Ambil semua dokumen
const getDocuments = async (req, res) => {
  const documents = await documentApi.getDocuments();
  res.status(200).json(documents);
};
const getDocumentsPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page 1
    const limit = parseInt(req.query.limit) || 10; // Default 10 data per halaman
    const search = req.query.search || '';

    const documents = await documentApi.getDocumentsPagination(page, limit, search);

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
};

// Update dokumen
const updateDocument = async (req, res) => {
  await documentApi.updateDocument(req.params.id, req.body);
  res.status(200).json({ message: 'Document updated' });
};

// Hapus dokumen
const deleteDocument = async (req, res) => {
  try {
    await documentApi.deleteDocument(req.params.id);
    res.status(200).json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error });
  }
};

module.exports = {
  addDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  getDocumentsPagination
};
