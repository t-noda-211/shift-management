import { ValueObjectError } from './valueObjectError'
import type { ValueObject } from './valueObject'

export class InvalidWorkSummaryError extends ValueObjectError {
  constructor(message: string) {
    super(message)
  }
}

/**
 * 従業員ごとに勤務日数や休暇日数を集計した結果の値オブジェクト
 */
export class WorkSummary implements ValueObject {
  readonly dayCountByShiftType: Record<string, number>
  readonly totalWorkDayCount: number
  readonly dayCountByTimeOffType: Record<string, number>
  readonly totalTimeOffDayCount: number

  constructor(
    dayCountByShiftType: Record<string, number>,
    dayCountByTimeOffType: Record<string, number>
  ) {
    // バリデーション: マップ内の日数は0以上である必要がある
    for (const [shiftType, dayCount] of Object.entries(dayCountByShiftType)) {
      if (dayCount < 0) {
        throw new InvalidWorkSummaryError(
          `Shift type "${shiftType}" days must be greater than or equal to 0`
        )
      }
    }

    for (const [timeOffType, dayCount] of Object.entries(
      dayCountByTimeOffType
    )) {
      if (dayCount < 0) {
        throw new InvalidWorkSummaryError(
          `Time off type "${timeOffType}" days must be greater than or equal to 0`
        )
      }
    }

    this.dayCountByShiftType = dayCountByShiftType
    this.totalWorkDayCount = Object.values(dayCountByShiftType).reduce(
      (acc, curr) => acc + curr,
      0
    )
    this.dayCountByTimeOffType = dayCountByTimeOffType
    this.totalTimeOffDayCount = Object.values(dayCountByTimeOffType).reduce(
      (acc, curr) => acc + curr,
      0
    )
  }

  equals(other: WorkSummary): boolean {
    if (this === other) {
      return true
    }

    if (
      !Object.keys(this.dayCountByShiftType).every(
        (shiftType) =>
          other.dayCountByShiftType[shiftType] ===
          this.dayCountByShiftType[shiftType]
      )
    ) {
      return false
    }

    if (this.totalWorkDayCount !== other.totalWorkDayCount) {
      return false
    }

    if (
      !Object.keys(this.dayCountByTimeOffType).every(
        (timeOffType) =>
          other.dayCountByTimeOffType[timeOffType] ===
          this.dayCountByTimeOffType[timeOffType]
      )
    ) {
      return false
    }

    if (this.totalTimeOffDayCount !== other.totalTimeOffDayCount) {
      return false
    }

    return true
  }
}
