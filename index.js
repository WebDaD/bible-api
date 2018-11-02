const express = require('express')
const app = express()
const server = require('http').createServer(app)
const config = require('./config.json')
const jsonfile = require('jsonfile')
const fs = require('fs')
const path = require('path')
var cookieParser = require('cookie-parser')
const Bible = require('./lib/bible.js')

const port = process.env.PORT || config.port

const translations = jsonfile.readFileSync('data/translations.json')
const structure = jsonfile.readFileSync('data/structure.json')

let bibles = {}
let bibleFiles = fs.readdirSync('data/bibles')
for (let index = 0; index < bibleFiles.length; index++) {
  const f = bibleFiles[index]
  bibles[f.replace('.json', '')] = jsonfile.readFileSync(path.join('data/bibles/', f))
}

let bible = new Bible(structure, bibles, translations)

const yearly = jsonfile.readFileSync('data/calendar/yearly.json')
const monthly = jsonfile.readFileSync('data/calendar/monthly.json')
const weekly = jsonfile.readFileSync('data/calendar/weekly.json')
const daily = jsonfile.readFileSync('data/calendar/daily.json')

app.use(cookieParser())

app.use(function (req, res, next) { // Enable Cors
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(function (req, res, next) { // readout translation and set to req.translation
  req.translation = req.query.translation || req.headers.translation || req.cookies.translation || 'elb'
  next()
})

app.get('/', function (req, res) {
  res.json({})
  // TODO: Get Basic Help Information. Send an index.html
})
app.get('/translations', function (req, res) {
  res.json(translations)
})
app.get('/translations/:language', function (req, res) {
  let result = {}
  let key
  for (key in translations) {
    if (translations.hasOwnProperty(key) && translations[key].language === req.params.language) {
      result[key] = translations[key]
    }
  }
  res.json(result)
})
app.get('/bible', function (req, res) {
  res.json(structure)
})
app.get('/bible/:book', function (req, res) {
  let book = bible.getBook(req.params.book)
  if (book) {
    res.json(book)
  } else {
    res.status(404).send('Book ' + req.params.book + ' not found')
  }
})
app.get('/bible/:book/:chapter', function (req, res) {
  let book = bible.getBook(req.params.book)
  if (book) {
    if (book.chapters[req.params.chapter]) {
      res.json(parseInt(book.chapters[req.params.chapter]))
    } else {
      res.status(404).send('Book ' + req.params.book + ' with Chapter ' + req.params.chapter + ' not found')
    }
  } else {
    res.status(404).send('Book ' + req.params.book + ' not found')
  }
})

app.get('/verse/:id', function (req, res) {
  if (req.params.id.includes('-')) { // is id: book-chapter-verse
    res.json(bible.getVerseFromID(req.params.id, req.translation)) // FIXME: if undefined, return 404
  } else {
    // TODO: parse CODE: <BookRef><Chapter>,<verse>[-<verse>][;Repeat]
  }
})

app.get('/ids/:book/:chapter/:verse', function (req, res) {
  res.json(bible.getIDs(req.params.book, req.params.chapter, req.params.verse)) // FIXME: if undefined, return 404
})
app.get('/ids/:book/:chapter', function (req, res) {
  res.json(bible.getIDs(req.params.book, req.params.chapter)) // FIXME: if undefined, return 404
})
app.get('/ids/:book', function (req, res) {
  res.json(bible.getIDs(req.params.book)) // FIXME: if undefined, return 404
})

app.get('/book/:book/:chapter/:verse', function (req, res) {
  let output = []
  let ids = bible.getIDs(req.params.book, req.params.chapter, req.params.verse)
  for (let index = 0; index < ids.length; index++) {
    const id = ids[index]
    output.push(bible.getVerseFromID(id, req.translation))
  }
  res.json(output) // FIXME: if undefined, return 404
})
app.get('/book/:book/:chapter', function (req, res) {
  let output = []
  let ids = bible.getIDs(req.params.book, req.params.chapter)
  for (let index = 0; index < ids.length; index++) {
    const id = ids[index]
    output.push(bible.getVerseFromID(id, req.translation))
  }
  res.json(output) // FIXME: if undefined, return 404
})
app.get('/book/:book', function (req, res) {
  let output = []
  let ids = bible.getIDs(req.params.book)
  for (let index = 0; index < ids.length; index++) {
    const id = ids[index]
    output.push(bible.getVerseFromID(id, req.translation))
  }
  res.json(output) // FIXME: if undefined, return 404
})

app.get('/yearly/:year', function (req, res) {
  res.json(bible.getVerseFromID(yearly[req.params.year], req.translation)) // FIXME: if undefined, return 404
})
app.get('/yearly/', function (req, res) {
  let output = {}
  for (var y in yearly) {
    if (yearly.hasOwnProperty(y)) {
      output[y] = bible.getVerseFromID(yearly[y], req.translation)
    }
  }
  res.json(output) // FIXME: if undefined, return 404
})

app.get('/monthly/:year/:month', function (req, res) {
  res.json(bible.getVerseFromID(monthly[req.params.year][req.params.month], req.translation)) // FIXME: if undefined, return 404
})
app.get('/monthly/:year', function (req, res) {
  let output = {}
  for (var m in monthly[req.params.year]) {
    if (monthly[req.params.year].hasOwnProperty(m)) {
      output[m] = bible.getVerseFromID(monthly[req.params.year][m], req.translation)
    }
  }
  res.json(output) // FIXME: if undefined, return 404
})
app.get('/monthly', function (req, res) {
  let output = {}
  for (var y in monthly) {
    if (monthly.hasOwnProperty(y)) {
      for (var m in monthly[y]) {
        if (monthly[y].hasOwnProperty(m)) {
          output[y][m] = bible.getVerseFromID(monthly[y][m], req.translation)
        }
      }
    }
  }
  res.json(output) // FIXME: if undefined, return 404
})

app.get('/weekly/:year/:week', function (req, res) {
  res.json(bible.getVerseFromID(weekly[req.params.year][req.params.week], req.translation)) // FIXME: if undefined, return 404
})
app.get('/weekly/:year', function (req, res) {
  let output = {}
  for (var w in weekly[req.params.year]) {
    if (weekly[req.params.year].hasOwnProperty(w)) {
      output[w] = bible.getVerseFromID(weekly[req.params.year][w], req.translation)
    }
  }
  res.json(output) // FIXME: if undefined, return 404
})
app.get('/weekly', function (req, res) {
  let output = {}
  for (var y in weekly) {
    if (weekly.hasOwnProperty(y)) {
      for (var w in weekly[y]) {
        if (weekly[y].hasOwnProperty(w)) {
          output[y][w] = bible.getVerseFromID(weekly[y][w], req.translation)
        }
      }
    }
  }
  res.json(output) // FIXME: if undefined, return 404
})
app.get('/daily/:year/:month/:day', function (req, res) {
  let output = bible.getVerseFromID(daily[req.params.year][req.params.month][req.params.day]['losung'], req.translation)
  if (output) {
    res.json(output) // FIXME: also lehrtext
  } else {
    res.status(404).json({error: 'No Daily Verses for Month ' + req.params.month + ' in year ' + req.params.year + ' found'})
  }
})
app.get('/daily/:year/:month', function (req, res) {
  let output = {}
  for (var d in daily[req.params.year][req.params.month]) {
    if (daily[req.params.year][req.params.month].hasOwnProperty(d)) {
      output[d] = bible.getVerseFromID(daily[req.params.year][req.params.month][d]['losung'], req.translation) // FIXME: also lehrtext
    }
  }
  if (output) {
    res.json(output)
  } else {
    res.status(404).json({error: 'No Daily Verses for Month ' + req.params.month + ' in year ' + req.params.year + ' found'})
  }
})
app.get('/daily/today', function (req, res) {
  // TODO: return daily for now!
})
app.get('/daily/:dateOrYear', function (req, res) {
  if (req.params.dateOrYear.includes('-')) { // is Date
    let ds = req.params.dateOrYear.split('-')
    let year = ds[0]
    let month = ds[1]
    let day = ds[2]
    res.json(bible.getVerseFromID(daily[year][month][day]['losung'], req.translation)) // FIXME: if undefined, return 404
    // FIXME: also lehrtext
  } else { // is Year
    let output = {}
    for (var m in daily[req.params.dateOrYear]) {
      if (daily[req.params.dateOrYear].hasOwnProperty(m)) {
        for (var d in daily[req.params.dateOrYear][m]) {
          if (daily[req.params.dateOrYear][m].hasOwnProperty(d)) {
            output[m][d] = bible.getVerseFromID(daily[req.params.dateOrYear][m][d]['losung'], req.translation) // FIXME: also lehrtext
          }
        }
      }
    }
    if (output) {
      res.json(output)
    } else {
      res.status(404).json({error: 'No Daily Verses for year ' + req.params.dateOrYear + ' found'})
    }
  }
})
app.get('/daily', function (req, res) {
  let output = {}
  for (var y in daily) {
    if (daily.hasOwnProperty(y)) {
      for (var m in daily[y]) {
        if (daily[y].hasOwnProperty(m)) {
          for (var d in daily[y][m]) {
            if (daily[y][m].hasOwnProperty(d)) {
              output[y][m][d] = bible.getVerseFromID(daily[y][m][d]['losung'], req.translation) // FIXME: also lehrtext
            }
          }
        }
      }
    }
  }
  if (output) {
    res.json(output)
  } else {
    res.status(404).json({error: 'No Daily Verses found'})
  }
})

server.listen(port)

console.log('bible-api running on Port ' + port)
