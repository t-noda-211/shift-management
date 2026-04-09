import { ulid, isValid as isValidUlid } from 'ulidx'

import type { ValueObject } from './valueObject'
import { DomainValidationError } from '../errors'

export class ShiftTypeId implements ValueObject {
  private constructor(readonly value: string) {}

  static create() {
    return new ShiftTypeId(ulid())
  }

  static from(value: string) {
    if (!isValidUlid(value)) {
      throw new DomainValidationError('Invalid ShiftType ID')
    }
    return new ShiftTypeId(value)
  }

  equals(other: ShiftTypeId): boolean {
    if (this === other) {
      return true
    }

    return this.value === other.value
  }
}
