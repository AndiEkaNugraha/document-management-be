const documentApi = require('../api');

// Tambah versi dokumen
const addDocumentVersion = async (req, res) => {
  const id = await documentApi.addDocumentVersion(req.params.id, req.body, req.file.filename);
  res.status(201).json({ id });
};

// Ambil semua versi dokumen berdasarkan id dokumen
const getDocumentVersions = async (req, res) => {
  const versions = await documentApi.getDocumentVersions(req.params.id);
  res.status(200).json(versions);
};
const deleteDocumentVersion = async (req, res) => {
  try {
    await documentApi.deleteDocumentVersion(req.params.versionId);
    res.status(200).json({ message: 'Document version deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document version', error });
  }
};

module.exports = {
  addDocumentVersion,
  getDocumentVersions,
  deleteDocumentVersion
};
