import { ulid, isValid as isValidUlid } from 'ulidx'
import { ValueObjectError } from './valueObjectError'

export class InvalidShiftAssignmentIdError extends ValueObjectError {
  constructor() {
    super('Invalid ShiftAssignment ID')
  }
}

export class ShiftAssignmentId {
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
}
