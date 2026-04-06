const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const settingsModel = require('./src/models/settingsModel');
const ResponseHelper = require('./src/helpers/responseHelper');

const app = express();
const PORT = process.env.port || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./src/routes');

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json(
    ResponseHelper.success({
      message: 'BE-Family API',
      status: 'Server is running',
      version: '1.0.0'
    })
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(
    ResponseHelper.error('2009')
  );
});

async function startServer() {
  try {
    console.log('Loading application settings...');
    await settingsModel.loadAllSettings();
    console.log('Settings loaded successfully');
  } catch (error) {
    console.warn('Warning: Could not load settings:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.code || 'development'}`);
  });
}

startServer();

module.exports = app;
