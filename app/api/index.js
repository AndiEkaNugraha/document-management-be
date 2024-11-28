const db = require('../../db');
const fs = require('fs');
const path = require('path');
// Tambah dokumen baru
const addDocument = async (data) => {
  const { document_title, document_type, department, information, created_by } = data;
  const [id] = await db('document').insert({
    document_title,
    document_type,
    department,
    information,
    created_by,
    created_at: db.fn.now()
  });
  return id;
};

// Tambah versi dokumen
const addDocumentVersion = async (document_id, data, filename) => {
  const { version, created_by, information } = data;
  const [id] = await db('version_mapping').insert({
    document_id,
    document_unique_name: filename,
    version,
    information,
    created_by,
    created_at: db.fn.now()
  });
  return id;
};

// Ambil semua dokumen
const getDocuments = async () => {
  const documents = await db('document').select();
  const version = await db('version_mapping').select('version').limit(1)
  const data = {...documents, version}
  return data;
};

const getDocumentById = async (id) => {
  const document = await db('document').where({ id }).first();
  return document;
};

const getDocumentsPagination = async (page = 1, limit = 10, search = '') => {
  try {
    const offset = (page - 1) * limit;
    
    // Hitung total jumlah dokumen dengan search di semua kolom
    const totalDocumentsQuery = db('document')
      .modify((queryBuilder) => {
        if (search) {
          queryBuilder
            .where('document_title', 'like', `%${search}%`)
            .orWhere('document_type', 'like', `%${search}%`)
            .orWhere('department', 'like', `%${search}%`)
            .orWhere('information', 'like', `%${search}%`)
            .orWhere('created_by', 'like', `%${search}%`)
            .orWhere('updated_by', 'like', `%${search}%`);
        }
      })
      .count('id as count')
      .first();

    const totalDocuments = await totalDocumentsQuery;

    // Dapatkan dokumen dengan search dan pagination
    const documentsQuery = db('document')
      .modify((queryBuilder) => {
        if (search) {
          queryBuilder
            .where('document_title', 'like', `%${search}%`)
            .orWhere('document_type', 'like', `%${search}%`)
            .orWhere('department', 'like', `%${search}%`)
            .orWhere('information', 'like', `%${search}%`)
            .orWhere('created_by', 'like', `%${search}%`)
            .orWhere('updated_by', 'like', `%${search}%`);
        }
      })
      .select('*')
      .offset(offset)
      .limit(limit);

    const documents = await documentsQuery;

    // Dapatkan versi dokumen terkait untuk setiap dokumen
    const documentsWithVersions = await Promise.all(
      documents.map(async (document) => {
        const version = await db('version_mapping')
          .select('version')
          .where('document_id', document.id)
          .orderBy('created_at', 'desc')
          .limit(1);
        
        return {
          ...document,
          version: version.length > 0 ? version[0].version : null, // Jika ada versi, ambil yang pertama
        };
      })
    );

    return {
      total: totalDocuments.count,
      page,
      limit,
      totalPages: Math.ceil(totalDocuments.count / limit),
      data: documentsWithVersions,
    };
  } catch (error) {
    throw new Error('Error fetching documents with pagination: ' + error.message);
  }
};



// Ambil versi dokumen berdasarkan id dokumen
const getDocumentVersions = async (document_id) => {
  const document = await getDocumentById(document_id);
  const versions = await db('version_mapping')
      .where({ document_id })
      .orderBy('created_at', 'desc');
  const data = { ...document, versions };
  return data;
};

// Update dokumen
const updateDocument = async (document_id, data) => {
  const { document_title, document_type, department, information, updated_by } = data;
  await db('document').where({ id: document_id }).update({
    document_title,
    document_type,
    department,
    information,
    updated_by,
    updated_at: db.fn.now()
  });
};

// Hapus dokumen
const deleteDocument = async (documentId) => {
  try {
    // Dapatkan semua versi terkait dengan dokumen
    const versions = await db('version_mapping')
      .select('document_unique_name', 'id')
      .where({ document_id: documentId }); // Nama kolom benar 'document_id'

    // Hapus semua versi dokumen terlebih dahulu
    for (const version of versions) {
      const filePath = path.join(__dirname, '../../uploads/', version.document_unique_name);

      // Hapus file dari sistem file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete file:', err);
        }
      });

      // Hapus versi dokumen dari database
      await db('version_mapping')
        .where({ id: version.id })
        .del();
    }

    // Setelah semua versi dihapus, hapus dokumennya
    await db('document')
      .where({ id: documentId })
      .del();

  } catch (error) {
    console.error('Error deleting document:', error.message);
    throw new Error('Error deleting document and versions');
  }
};

const deleteDocumentVersion = async (versionId) => {
  // Pertama, dapatkan nama file yang akan dihapus
  const version = await db('version_mapping')
    .select('document_unique_name')
    .where({ id: versionId })
    .first();
  console.log(version)
  if (version) {
    // Path ke file yang akan dihapus
    const filePath = path.join(__dirname, '../../uploads/', version.document_unique_name);
    
    // Hapus versi dari database
    await db('version_mapping')
      .where({ id: versionId })
      .del();

    // Hapus file dari filesystem
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete file:', err);
      } else {
        console.log('File deleted successfully:', filePath);
      }
    });
  } else {
    throw new Error('Version not found');
  }
};   

module.exports = {
  addDocument,
  addDocumentVersion,
  getDocuments,
  getDocumentsPagination,
  getDocumentVersions,
  updateDocument,
  deleteDocument,
  deleteDocumentVersion
};
