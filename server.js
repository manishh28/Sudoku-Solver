'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes/api.js');

const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: '*' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/').get((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Mount API routes
apiRoutes(app);

// 404 handler
app.use((req, res) => {
  res.status(404).type('text').send('Not Found');
});

const PORT = process.env.PORT || 3000;
const listener = app.listen(PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app; // for testing
