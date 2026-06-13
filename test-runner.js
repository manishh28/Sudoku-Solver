const Mocha = require('mocha');
const path = require('path');

const testDir = 'tests';

module.exports = function () {
  const mocha = new Mocha();
  const testFiles = ['1_unit-tests.js', '2_functional-tests.js'];

  testFiles.forEach((file) => {
    mocha.addFile(path.join(__dirname, testDir, file));
  });

  const runner = mocha.run(function (failures) {
    process.exitCode = failures ? 1 : 0;
  });

  const results = [];

  runner
    .on('test end', function (test) {
      results.push(test);
    })
    .on('end', function () {
      console.log('Tests completed');
      module.exports.report = formatResults(results);
    });
};

function formatResults(arr) {
  return arr.map((el) => {
    let state = el.state;
    if (el.pending) state = 'pending';

    return {
      title: el.title,
      fullTitle: el.fullTitle(),
      duration: el.duration,
      state,
      err: el.err ? (el.err.message || String(el.err)) : ''
    };
  });
}
