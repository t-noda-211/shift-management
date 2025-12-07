import { ulid, isValid as isValidUlid } from 'ulidx'
import { ValueObjectError } from './valueObjectError'

export class InvalidShiftTypeIdError extends ValueObjectError {
  constructor() {
    super('Invalid ShiftType ID')
  }
}

export class ShiftTypeId {
  private constructor(readonly value: string) {}

  static create() {
    return new ShiftTypeId(ulid())
  }

  static from(value: string) {
    if (!isValidUlid(value)) {
      throw new InvalidShiftTypeIdError()
    }
    return new ShiftTypeId(value)
  }
}
