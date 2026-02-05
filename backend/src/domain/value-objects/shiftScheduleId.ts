import { ulid, isValid as isValidUlid } from 'ulidx'

import type { ValueObject } from './valueObject'
import { ValueObjectError } from './valueObjectError'

export class InvalidShiftScheduleIdError extends ValueObjectError {
  constructor() {
    super('Invalid ShiftSchedule ID')
  }
}

export class ShiftScheduleId implements ValueObject {
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

  equals(other: ShiftScheduleId): boolean {
    if (this === other) {
      return true
    }

    return this.value === other.value
  }
}
