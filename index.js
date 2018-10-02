const express = require('express')
const app = express()
const server = require('http').createServer(app)
const config = require('./config.json')
const jsonfile = require('jsonfile')

const port = process.env.PORT || config.port

// TODO: read bible files into memory

app.get('/', function (req, res) {
  res.json({})
  // TODO: Get Basic Help Information. Send an index.html
})

app.get('/translations', function (req, res) {
  res.json([
    'ELB',
    'SCH'
  ])
  // TODO: replace with file
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

/translations > Get List of Translations

/bible > Get List of Books with Chapters and VerseNumbers
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
  }
}

TRANSLATION OBJECT
{
  ref: "String",
  name: "String"
}

CODE:
<BookRef><Chapter>,<verse>[-<verse>][;Repeat]

*/

server.listen(port)

console.log('bible-api running on Port ' + port)
