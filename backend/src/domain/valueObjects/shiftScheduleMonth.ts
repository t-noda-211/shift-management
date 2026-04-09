import type { ValueObject } from './valueObject'
import { DomainValidationError } from '../errors'

/**
 * シフトスケジュールの月を表す値オブジェクト
 */
export class ShiftScheduleMonth implements ValueObject {
  readonly value: number

  static readonly MIN_MONTH = 1
  static readonly MAX_MONTH = 12

  constructor(value: number) {
    if (
      !Number.isInteger(value) ||
      value < ShiftScheduleMonth.MIN_MONTH ||
      value > ShiftScheduleMonth.MAX_MONTH
    ) {
      throw new DomainValidationError(
        'Shift Schedule Month must be between 1 and 12'
      )
    }
    this.value = value
  }

  equals(other: ShiftScheduleMonth): boolean {
    if (this === other) {
      return true
    }

    return this.value === other.value
  }
}
