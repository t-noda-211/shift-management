import { ulid, isValid as isValidUlid } from 'ulidx'
import { ValueObjectError } from './valueObjectError'

export class InvalidShiftNoticeIdError extends ValueObjectError {
  constructor() {
    super('Invalid ShiftNotice ID')
  }
}

export class ShiftNoticeId {
  private constructor(readonly value: string) {}

  static create() {
    return new ShiftNoticeId(ulid())
  }

  static from(value: string) {
    if (!isValidUlid(value)) {
      throw new InvalidShiftNoticeIdError()
    }
    return new ShiftNoticeId(value)
  }
}
