const express = require('express')
const app = express()
const server = require('http').createServer(app)
const config = require('./config.json')
const jsonfile = require('jsonfile')

const port = process.env.PORT || config.port

const translations = jsonfile.readFileSync('data/translations.json')
const structure = jsonfile.readFileSync('data/structure.json')
// TODO: read bible files into memory

app.get('/', function (req, res) {
  res.json({})
  // TODO: Get Basic Help Information. Send an index.html
})

app.get('/secret-restart', function (req, res) {
  process.exit(0)
  // TODO: remove this
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
  let b = req.params.book
  let result = {}
  let key
  for (key in structure) {
    if (structure.hasOwnProperty(key)) {
      if (typeof b === 'number') {
        if (structure[key].number === b) {
          result[key] = structure[key]
        }
      } else { // ref
        if (structure[key].ref.de === b) {
          result[key] = structure[key]
        }
      }
    }
  }

  res.json(result)
})
/*
Returns: json ONLY
*/

/*
PATHS:

/verse/id > GET Verse by ID
/verse/code > GET Verse(s) by Code

/book/chapter/verse > GET Verse-Object
/book/chapter > GET List of Verse-Objects
/book > GET List of Verse-Objects

/monthly/year/month > GET Verse-Object
/monthly/year > GET List of Verse-Objects, preset by month
/monthly > GET List of Verse-Objects, preset by year and month

/weekly/year/week > GET Verse-Object
/weekly/year > GET List of Verse-Objects, preset by week
/weekly > GET List of Verse-Objects, preset by year and week

/daily/date > GET Verse-Object
/daily/year > GET List of Verse-Objects, preset by date
/daily > GET List of Verse-Objects, preset by date

/bible/book > Get Chapters and VerseNumbers
/bible/book/chapter > Get Number of Verses

/ > GET some usage Information, mainly Links

PARAMS:
translation=XXX

VERSE OBJECT
{
  id: 'internal-id (=booknr-chapter-verse)',
  book: {
    BOOK OBJECT
  },
  chapter: INT,
  verse: INT,
  text: "String",
  translation: {
    TRANSLATION OBJECT
  }
}

BOOK OBJECT
{
  number: INT,
  ref: {
    de: "string",
    en: "string",
    ...
  },
  title: {
    de: "string",
    en: "string",
    ...
  },
  chapters: {
    "number": "int verses"
  }
}

CODE:
<BookRef><Chapter>,<verse>[-<verse>][;Repeat]

*/

server.listen(port)

console.log('bible-api running on Port ' + port)
