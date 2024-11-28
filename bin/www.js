  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const documentRoutes = require('../routes/documentRoutes');
  const versionRoutes = require('../routes/versionRoutes');
  const path = require('path');
  const uploadsPath = path.join(__dirname, '../uploads');
  const app = express();

  require('dotenv').config();
  
  app.use(bodyParser.json());
  app.use(cors());
  
  app.use('/uploads', express.static(uploadsPath));
  app.get('/api/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsPath, filename);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(404).send('File tidak ditemukan');
      }
    });
  });

  // Routes
  app.use('/api', documentRoutes);
  app.use('/api', versionRoutes);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
