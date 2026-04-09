export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name

    // Error クラスのスタックトレースを正しく保持するため
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class DomainValidationError extends DomainError {
  constructor(message: string) {
    super(message)
  }
}
