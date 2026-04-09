import { isValid as isValidUlid, ulid } from 'ulidx'

import type { ValueObject } from './valueObject'
import { DomainValidationError } from '../errors'

export class ShiftNoticeId implements ValueObject {
  private constructor(readonly value: string) {}

  static create() {
    return new ShiftNoticeId(ulid())
  }

  static from(value: string) {
    if (!isValidUlid(value)) {
      throw new DomainValidationError('Invalid ShiftNotice ID')
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
