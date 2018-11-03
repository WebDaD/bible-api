/**
 * @overview Object-Representation of an Error
 * @module Error
 * @author Dominik Sigmund
 * @version 1.0
 * @description Allows to export JSON
 * @memberof bible-api
 */

/** Simple Object Class Error
 * @class Error
 * */
export class Error {

  private _message:string
  private _status:number
  private _details:string

  /** Create an Instance
   * @param {string} message - The Error Message
   * @param {number} status - HTTP Status of Error
   * @param {string} details - Detailed Info like a Callstack
   * @returns {Error} Instance of Object Error
   * */
  constructor(message:string, status:number, details?:string) {
    this._message = message
    this._status = status
    if(details) {
      this._details = details
    } else {
      this._details = ''
    }
    
  }
  
  /** Return The Status-Code
   * @returns {number} HTTP Status of this Error
   * */
  public Status(): number {
    return this._status
  }

  /** Return this Instance to a JSON-Object
   * @returns {object} JSON-Object of Object Error
   * */
  public toJSON() {
    return {
      message: this._message,
      status:this._status,
      details: this._details
    }
  }
}
export default Error