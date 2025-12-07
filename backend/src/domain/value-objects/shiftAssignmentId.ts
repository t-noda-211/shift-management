import { ulid, isValid as isValidUlid } from 'ulidx'

export class InvalidShiftAssignmentIdError extends Error {
  constructor() {
    super('Invalid ShiftAssignment ID')
    this.name = 'InvalidShiftAssignmentIdError'
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
