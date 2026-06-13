'use strict';

module.exports = function(app) {

  app.route('/_api/app-info').get(function(req, res) {
    const routes = app._router.stack
      .filter(r => r.route)
      .map(r => r.route.path);
    res.json({ routes });
  });

  app.route('/_api/get-tests').get(function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    const Mocha = require('mocha');
    const path  = require('path');

    try {
      const type = req.query.type || 'all';
      const mocha = new Mocha({ timeout: 10000, ui: 'tdd' });
      mocha.suite.emit('pre-require', global, '', mocha);

      if (type === 'unit' || type === 'all') {
        const f = path.join(process.cwd(), 'tests', '1_unit-tests.js');
        delete require.cache[require.resolve(f)];
        mocha.addFile(f);
      }
      if (type === 'functional' || type === 'all') {
        const f = path.join(process.cwd(), 'tests', '2_functional-tests.js');
        delete require.cache[require.resolve(f)];
        mocha.addFile(f);
      }

      const output = [];
      mocha.run()
        .on('pass', test => {
          output.push({
            title:      test.fullTitle(),
            context:    test.titlePath()[0] || 'Tests',
            state:      'passed',
            assertions: [{ method: 'equal', args: ['true', 'true'] }]
          });
        })
        .on('fail', (test, err) => {
          output.push({
            title:      test.fullTitle(),
            context:    test.titlePath()[0] || 'Tests',
            state:      'failed',
            assertions: [{ method: 'assert', args: [err.message || String(err)] }]
          });
        })
        .on('end', () => res.json(output));
    } catch(err) {
      console.error('Test runner error:', err);
      res.status(500).json({ error: err.message });
    }
  });
};
