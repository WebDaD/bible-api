// Simple Import Script to read in files and copy them to data.
// Modes: Bible, Losungen (daily), Wochensprüche
// Monatslosungen und Jahreslosungen von Hand.

var program = require('commander')
var moment = require('moment')
var pack = require('./package.json')

program
  .version(pack.version)

program
  .command('bible')
  .alias('b')
  .action(function (args, options) {
    // TODO: Import given Bible
  })

program
  .command('daily')
  .alias('d')
  .action(function (args, options) {
    // TODO: Import Daily (losungen.xml)
  })

program
  .command('weekly')
  .alias('w')
  .action(function (args, options) {
    // TODO: Import Weekly
  })

program.parse(process.argv)
