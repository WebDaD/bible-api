/**
 * @overview Object-Representation of one Verse
 * @module Verse
 * @author Dominik Sigmund
 * @version 1.0
 * @description Allows to export or Import JSON
 * @memberof bible-api
 */

import Book from './Book'
import Translation from './Translation'

/** Simple Object Class Verse
 * @class Verse
 * */
export class Verse {

  private _id:string
  private _book:Book
  private _chapter:number
  private _verse:number
  private _text:string
  private _translation:Translation

  /** Create an Instance
   * @param {string} id - The Verse ID
   * @param {Translation} translation - The Translation to use for the text
   * @returns {Verse} Instance of Object Verse
   * */
  constructor(id:string, translation:Translation) {
    this._id = id
    this._translation = translation
    this._text = this._translation.getText(this._id)
    let split = this._id.split('-')
    this._book = new Book(parseInt(split[0]))
    this._chapter = parseInt(split[1])
    this._verse = parseInt(split[2])
  }
  
  /** Return this Instance to a JSON-Object
   * @returns {object} JSON-Object of Object ItemField
   * */
  public toJSON() {
    return {
      id: this._id,
      book:this._book.toJSON(),
      chapter: this._chapter,
      verse: this._verse,
      text: this._text,
      translation: this._translation.toJSON()
    }
  }
}
export default Verse