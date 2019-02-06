
import Error from './Error'

/** Simple Object Class Book
 * @class Book
 * */
export class Book {
  private _id:number

  constructor(id:number) {
    this._id = id
    // TODO: Load MetaData (chapters, verses, refs, ...)
  }

  public getNumber (): number {
    return this._id
  }

  public toJSON() {

  }
}
export default Book