/* global it, describe, beforeEach, afterEach */
const Bible = require('../lib/bible')
let bible

const fs = require('fs')
const path = require('path')
const jsonfile = require('jsonfile')
const translations = jsonfile.readFileSync('data/translations.json')
const structure = jsonfile.readFileSync('data/structure.json')
let bibles = {}
let bibleFiles = fs.readdirSync('data/bibles')
for (let index = 0; index < bibleFiles.length; index++) {
  const f = bibleFiles[index]
  bibles[f.replace('.json', '')] = jsonfile.readFileSync(path.join('data/bibles/', f))
}

const assert = require('assert')
describe('Bible.js', function () {
  beforeEach('create Bible', function () {
    bible = new Bible(structure, bibles, translations)
  })
  afterEach('destroy Bible', function () {
    bible = undefined
  })
  describe('getVerse', function () {
    it('should return a single number as array of one', function () {
      let input = '1'
      assert.deepStrictEqual(bible.getVerse(input), [1])
    })
    it('should return a range of numbers as full array', function () {
      let input = '1-3'
      assert.deepStrictEqual(bible.getVerse(input), [1, 2, 3])
    })
    it('should return a list of numbers as array', function () {
      let input = '1,3,7'
      assert.deepStrictEqual(bible.getVerse(input), [1, 3, 7])
    })
  })
  
})
