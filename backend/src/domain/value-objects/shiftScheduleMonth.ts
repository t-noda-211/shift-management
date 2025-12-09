import { ValueObjectError } from './valueObjectError'

export class InvalidShiftScheduleMonthError extends ValueObjectError {
  constructor() {
    super('Shift Schedule Month must be between 1 and 12')
  }
}

/**
 * シフトスケジュールの月を表す値オブジェクト
 */
export class ShiftScheduleMonth {
  readonly value: number

  static readonly MIN_MONTH = 1
  static readonly MAX_MONTH = 12

  constructor(value: number) {
    if (
      !Number.isInteger(value) ||
      value < ShiftScheduleMonth.MIN_MONTH ||
      value > ShiftScheduleMonth.MAX_MONTH
    ) {
      throw new InvalidShiftScheduleMonthError()
    }
    this.value = value
  }
}
