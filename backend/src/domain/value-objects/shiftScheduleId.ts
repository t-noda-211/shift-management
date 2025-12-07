import { ulid, isValid as isValidUlid } from 'ulidx'

export class InvalidShiftScheduleIdError extends Error {
  constructor() {
    super('Invalid ShiftSchedule ID')
    this.name = 'InvalidShiftScheduleIdError'
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
