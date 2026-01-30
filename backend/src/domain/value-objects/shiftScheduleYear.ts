import { ValueObjectError } from './valueObjectError'
import type { ValueObject } from './valueObject'

export class InvalidShiftScheduleYearError extends ValueObjectError {
  constructor() {
    super(
      `Shift Schedule Year must be between ${ShiftScheduleYear.MIN_YEAR} and ${ShiftScheduleYear.MAX_YEAR}`
    )
  }
}

/**
 * シフトスケジュールの年を表す値オブジェクト
 */
export class ShiftScheduleYear implements ValueObject {
  readonly value: number

  static readonly MIN_YEAR = 2000
  static readonly MAX_YEAR = 2100

  constructor(value: number) {
    if (
      !Number.isInteger(value) ||
      value < ShiftScheduleYear.MIN_YEAR ||
      value > ShiftScheduleYear.MAX_YEAR
    ) {
      throw new InvalidShiftScheduleYearError()
    }
    this.value = value
  }

  equals(other: ShiftScheduleYear): boolean {
    if (this === other) {
      return true
    }

    return this.value === other.value
  }
}
