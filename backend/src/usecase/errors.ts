/**
 * ユースケースのエラーの基底クラス
 * すべてのユースケースのカスタムエラーはこのクラスを継承する
 */
export abstract class UsecaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name

    // Error クラスのスタックトレースを正しく保持するため
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class ValidationError extends UsecaseError {
  constructor() {
    super('不正な入力です')
  }
}
