/**
 * 共有のエラーの基底クラス
 * すべてのshared配下のカスタムエラーはこのクラスを継承する
 */
export abstract class SharedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name

    // Error クラスのスタックトレースを正しく保持するため
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
