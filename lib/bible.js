// List of functions to use in api and importer. also allows easy testing

function Bible (structure, bibles, translations) {
  this.structure = structure
  this.bibles = bibles
  this.translations = translations
  this.getVerse = getVerse
  this.getChapter = getChapter
  this.getBook = getBook
  this.getIDs = getIDs
  this.getVerseFromID = getVerseFromID
  this.getIDsFromCode = getIDsFromCode
  return this
}

module.exports = Bible

function getVerse (verse) {
  verse = verse.toString()
  let verses = []
  if (verse.includes('-')) { // list of verses given: x to y
    let vs = verse.split('-')
    let from = vs[0]
    let to = vs[1]
    for (let index = from; index <= to; index++) {
      verses.push(parseInt(index))
    }
  } else if (verse.includes(',')) { // some verses given: x,y,z
    verses = verse.split(',')
    for (let index = 0; index < verses.length; index++) {
      verses[index] = parseInt(verses[index])
    }
  } else { // single verse given
    verses.push(parseInt(verse))
  }
  return verses
}
function getChapter (book, chapter) {
  let chapters = []
  if (chapter.includes('-')) { // list of chapters given: x to y
    let cs = chapter.split('-')
    let from = cs[0]
    let to = cs[1]
    for (let index = from; index <= to; index++) {
      chapters.push({chapter: index, verses: book.chapters[index]})
    }
  } else if (chapter.includes(',')) { // some chapters given: x,y,z
    let cs = chapter.split(',')
    for (let index = 0; index < cs.length; index++) {
      const element = cs[index]
      chapters.push({chapter: element, verses: book.chapters[element]})
    }
  } else { // single chapter given
    chapters.push({chapter: chapter, verses: book.chapters[chapter]})
  }
  return chapters
}
function getBook (ref) { // maybe number or ref
  let self = this
  let b = parseInt(ref)
  if (!isNaN(b)) { // is a number
    if (self.structure[b]) {
      return self.structure[b]
    } else {
      return undefined
    }
  } else { // is a string
    let key
    for (key in self.structure) {
      if (self.structure.hasOwnProperty(key)) {
        if (self.structure[key].ref.de.toLowerCase() === ref.toLowerCase()) { // FIXME: check all refs (language)
          return self.structure[key]
        }
      }
    }
    return undefined
  }
}
function getIDs (book, chapter, verse) { // chapter or verse optional. chapter/verse: # | #-# | #,#,#
  let ids = []
  let bookObj = this.getBook(book)
  if (bookObj) {
    if (chapter) {
      let chapterObj = this.getChapter(bookObj, chapter)
      if (chapterObj) {
        if (verse) {
          for (let index = 0; index < chapterObj.length; index++) {
            const c = chapterObj[index]
            let verseObj = this.getVerse(verse)
            for (let counter = 0; counter < verseObj.length; counter++) {
              const v = verseObj[counter]
              ids.push(bookObj.number + '-' + c.chapter + '-' + v)
            }
          }
        } else {
          for (let index = 0; index < chapterObj.length; index++) {
            const c = chapterObj[index]
            for (let counter = 1; counter <= c.verses; counter++) {
              ids.push(bookObj.number + '-' + c.chapter + '-' + counter)
            }
          }
        }
      } else {
        return ids
      }
    } else {
      for (var c in bookObj.chapters) {
        if (bookObj.chapters.hasOwnProperty(c)) {
          for (let counter = 1; counter <= bookObj.chapters[c]; counter++) {
            ids.push(bookObj.number + '-' + c + '-' + counter)
          }
        }
      }
    }
  }
  return ids
}

function getVerseFromID (internalID, translation) {
  let self = this
  let split = internalID.split('-')
  let book = split[0]
  let chapter = split[1]
  let verse = split[2]

  let text = self.bibles[translation][book][chapter][verse]
  if (text) {
    return {
      id: internalID,
      book: self.structure[book],
      chapter: chapter,
      verse: verse,
      text: text,
      translation: self.translations[translation]
    }
  } else {
    return undefined
  }
}
function getIDsFromCode (code) { // <BookRef><Chapter>,<verse>[-<verse>][;Repeat]
  // TODO: parse the code and return an Array of Internal Ids
  return ['1-1-1']
}