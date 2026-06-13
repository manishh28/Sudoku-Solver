const cors = require('cors');

module.exports = function (app) {
  // Allow the FCC test evaluator (running in the browser on a different origin) to call this
  app.use('/_api', cors({ origin: '*' }));

  app.route('/_api/get-tests').get((req, res) => {
    const testRunner = require('../test-runner.js');
    res.json(testRunner.report || []);
  });
};
