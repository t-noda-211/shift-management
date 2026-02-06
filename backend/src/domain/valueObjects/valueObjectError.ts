/**
 * 値オブジェクトのエラーの基底クラス
 * すべての値オブジェクトのカスタムエラーはこのクラスを継承する
 */
export abstract class ValueObjectError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name

    // Error クラスのスタックトレースを正しく保持するため
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
