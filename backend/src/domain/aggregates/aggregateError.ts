/**
 * エンティティ（集約）のエラーの基底クラス
 * すべてのエンティティのカスタムエラーはこのクラスを継承する
 */
export abstract class AggregateError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name

    // Error クラスのスタックトレースを正しく保持するため
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
