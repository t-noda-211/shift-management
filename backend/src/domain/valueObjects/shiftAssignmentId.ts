import { isValid as isValidUlid, ulid } from 'ulidx'

import type { ValueObject } from './valueObject'
import { DomainValidationError } from '../errors'

export class ShiftAssignmentId implements ValueObject {
  private constructor(readonly value: string) {}

  static create() {
    return new ShiftAssignmentId(ulid())
  }

  static from(value: string) {
    if (!isValidUlid(value)) {
      throw new DomainValidationError('Invalid ShiftAssignment ID')
    }
    return new ShiftAssignmentId(value)
  }

  equals(other: ShiftAssignmentId): boolean {
    if (this === other) {
      return true
    }

    return this.value === other.value
  }
}
