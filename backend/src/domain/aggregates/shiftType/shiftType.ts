import {
  ShiftTypeId,
  ShiftTypeName,
  ShiftTypeTime,
} from '@/domain/value-objects'

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
  private constructor(
    public readonly id: ShiftTypeId,
    private _name: ShiftTypeName,
    private _startTime: ShiftTypeTime,
    private _endTime: ShiftTypeTime
  ) {}

  get name(): string {
    return this._name.value
  }

  get startTime(): ShiftTypeTime {
    return this._startTime
  }

  get endTime(): ShiftTypeTime {
    return this._endTime
  }

  static create(
    name: string,
    startTime: ShiftTypeTime,
    endTime: ShiftTypeTime
  ): ShiftType {
    ShiftType.validateEndTimeMustBeAfterStartTime(startTime, endTime)
    const id = ShiftTypeId.create()
    return new ShiftType(id, new ShiftTypeName(name), startTime, endTime)
  }

  private static validateEndTimeMustBeAfterStartTime(
    startTime: ShiftTypeTime,
    endTime: ShiftTypeTime
  ): void {
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

  static from(
    id: ShiftTypeId,
    name: ShiftTypeName,
    startTime: ShiftTypeTime,
    endTime: ShiftTypeTime
  ): ShiftType {
    return new ShiftType(id, name, startTime, endTime)
  }

  updateName(name: string): void {
    this._name = new ShiftTypeName(name)
  }

  updateTime(startTime: ShiftTypeTime, endTime: ShiftTypeTime): void {
    ShiftType.validateEndTimeMustBeAfterStartTime(startTime, endTime)
    this._startTime = startTime
    this._endTime = endTime
  }
}
