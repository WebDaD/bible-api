// Loads structure.json
// List of Books and Search on them
/**
 * @overview Object-Representation of the Bible
 * @module Bible
 * @author Dominik Sigmund
 * @version 1.0
 * @description Allows to export or Import JSON and to Access Books and Search
 * @memberof bible-api
 */

import Book from './Book'
import Verse from './Verse'
import Translation from './Translation'

/** Simple Object Class Bible
 * @class Bible
 * */
export class Bible {

  private _file:string
  private _books:Book[]

  /** Create an Instance
   * @param {string} file - Structure.json to load
   * @returns {Bible} Instance of Object Bible
   * */
  constructor(file:string) {
    this._file = file
    // TODO: Parse file and create Books from Structure
  }
  
  /** Return this Instance to a JSON-Object
   * @returns {object} JSON-Object of Object ItemField
   * */
  public toJSON() {
    let ret = {}
    for (let index = 0; index < this._books.length; index++) {
      const book = this._books[index]
      ret[book.getNumber()] = book.toJSON()
    }
    return ret
  }

  public getVerseByID(internalID: string, translation:Translation): Verse | Error {
    // TODO: find verse, export.
    return new Verse('1-1-1', null) // FIXME: Add translation
  }

  public getVersesByPath(book: number | string, chapter: number | string, verse: number | string, translation:Translation): Verse[] | Error {
    // TODO: find verses, export.
  }

  public getVersesByCode(bibleCode: string, translation:Translation): Verse[] | Error {
    // TODO: find verses, export. // <BookRef><Chapter>,<verse>[-<verse>][;Repeat]
  }
}
export default Bible