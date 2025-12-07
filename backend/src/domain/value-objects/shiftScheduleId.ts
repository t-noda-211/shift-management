import { ulid, isValid as isValidUlid } from 'ulidx'
import { ValueObjectError } from './valueObjectError'

export class InvalidShiftScheduleIdError extends ValueObjectError {
  constructor() {
    super('Invalid ShiftSchedule ID')
  }
}

export class ShiftScheduleId {
  private constructor(readonly value: string) {}

  static create() {
    return new ShiftScheduleId(ulid())
  }

  static from(value: string) {
    if (!isValidUlid(value)) {
      throw new InvalidShiftScheduleIdError()
    }
    return new ShiftScheduleId(value)
  }
}
