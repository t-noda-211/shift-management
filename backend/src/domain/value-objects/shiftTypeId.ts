import { ulid, isValid as isValidUlid } from 'ulidx'

export class InvalidShiftTypeIdError extends Error {
  constructor() {
    super('Invalid ShiftType ID')
    this.name = 'InvalidShiftTypeIdError'
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
