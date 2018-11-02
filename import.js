// Simple Import Script to read in files and copy them to data.
// Modes: Bible, Losungen (daily csv tab sep), Wochensprüche
// Monatslosungen und Jahreslosungen von Hand.

var program = require('commander')
const jsonfile = require('jsonfile')
var pack = require('./package.json')
const Bible = require('./lib/bible.js')
const structure = jsonfile.readFileSync('data/structure.json')
let bible = new Bible(structure)
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
    let daily = jsonfile.readFileSync('data/calendar/daily.json')
    let file = args
    if (!file) {
      return console.error('No File given!')
    }
    console.log('Reading in ' + file)
    let lines = require('fs').readFileSync(file, 'utf-8').split('\n').filter(Boolean)
    for (let index = 1; index < lines.length; index++) {
      const line = lines[index]
      let contents = line.split('\t')
      let dateSplit = contents[0].split('.')
      if (!daily[dateSplit[2]]) {
        daily[dateSplit[2]] = {}
      }
      if (!daily[dateSplit[2]][dateSplit[1]]) {
        daily[dateSplit[2]][dateSplit[1]] = {}
      }
      daily[dateSplit[2]][dateSplit[1]][dateSplit[0]] = {
        losung: bible.getIDsFromCode(contents[3])[0],
        lehrtext: bible.getIDsFromCode(contents[5])[0]
      }
    }
    jsonfile.writeFileSync('data/calendar/daily.json', daily)
    console.log('Done.')
  })

program
  .command('weekly')
  .alias('w')
  .action(function (args, options) {
    // TODO: Import Weekly
  })

program.parse(process.argv)
