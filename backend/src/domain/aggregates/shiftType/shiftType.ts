import { ShiftTypeId } from '@/domain/value-objects/shiftTypeId'
import { ShiftTypeName } from '@/domain/value-objects/shiftTypeName'
import { ShiftTypeTime } from '@/domain/value-objects/shiftTypeTime'
import { AggregateError } from '../aggregateError'

/**
 * 終業時間が始業時間より前の場合のエラー
 */
export class EndTimeMustBeAfterStartTimeError extends AggregateError {
  constructor() {
    super('End time must be after start time')
  }
}

/**
 * ShiftType エンティティ
 * シフト区分（早番・遅番など）を表す集約ルート
 */
export class ShiftType {
  constructor(
    public readonly id: ShiftTypeId,
    public readonly name: ShiftTypeName,
    public readonly startTime: ShiftTypeTime,
    public readonly endTime: ShiftTypeTime
  ) {
    // 終業時間は始業時間より後でなければならない
    if (endTime.toMinutes() <= startTime.toMinutes()) {
      throw new EndTimeMustBeAfterStartTimeError()
    }
  }

  /**
   * 開始時刻と終了時刻の差を時間単位（小数点第1位まで、切り上げ）で取得する
   */
  getDurationHours(): number {
    const minutesDiff = this.endTime.toMinutes() - this.startTime.toMinutes()
    const hours = minutesDiff / 60
    // 小数第1位まで切り上げ
    return Math.ceil(hours * 10) / 10
  }
}
