
import Error from './Error'

/** Simple Object Class Verse
 * @class Book
 * */
export class Book {
  private _id:number

  constructor(id:number) {
    this._id = id
  }

  public byRef (ref:string): Book | Error {
    // TODO: getBook byRef
    return new Book(1)
  }

  public toJSON() {

  }
}
export default Book