'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: '*' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/').get((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// FCC test result endpoint
fccTestingRoutes(app);

// Mount API routes
apiRoutes(app);

// 404 handler
app.use((req, res) => {
  res.status(404).type('text').send('Not Found');
});

const PORT = process.env.PORT || 3000;
const listener = app.listen(PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(() => {
      try {
        runner();
      } catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 1500);
  }
});

module.exports = app; // for testing
