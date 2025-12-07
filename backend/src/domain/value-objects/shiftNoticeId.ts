import { ulid, isValid as isValidUlid } from 'ulidx'

export class InvalidShiftNoticeIdError extends Error {
  constructor() {
    super('Invalid ShiftNotice ID')
    this.name = 'InvalidShiftNoticeIdError'
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
