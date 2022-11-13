const parser = require('../index');
const util = require('util');
const fs = require('fs');


function consolelog(...args) {
  console.log(util.inspect(...args, false, null, true));
}

const files = fs.readdirSync('./test/cases');

describe('Test cases', function() {
  for (const f of files) {

    it(`Case '${f}'`, function() {
      const diff = parser.parseDiffFileSync(`./test/cases/${f}`);
      if (diff.errors.length > 0) {
        throw new Error(`Errors found: ${diff.errors}`);
      }
    });

  }
});
