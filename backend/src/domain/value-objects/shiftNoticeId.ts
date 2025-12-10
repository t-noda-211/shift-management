import { ulid, isValid as isValidUlid } from 'ulidx'
import { ValueObjectError } from './valueObjectError'
import type { ValueObject } from './valueObject'

export class InvalidShiftNoticeIdError extends ValueObjectError {
  constructor() {
    super('Invalid ShiftNotice ID')
  }
}

export class ShiftNoticeId implements ValueObject {
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

  equals(other: ShiftNoticeId): boolean {
    if (this === other) {
      return true
    }

    return this.value === other.value
  }
}
