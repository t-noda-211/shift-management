import { ulid, isValid as isValidUlid } from 'ulidx'
import { ValueObjectError } from './valueObjectError'
import type { ValueObject } from './valueObject'

export class InvalidShiftAssignmentIdError extends ValueObjectError {
  constructor() {
    super('Invalid ShiftAssignment ID')
  }
}

export class ShiftAssignmentId implements ValueObject {
  private constructor(readonly value: string) {}

  static create() {
    return new ShiftAssignmentId(ulid())
  }

  static from(value: string) {
    if (!isValidUlid(value)) {
      throw new InvalidShiftAssignmentIdError()
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
