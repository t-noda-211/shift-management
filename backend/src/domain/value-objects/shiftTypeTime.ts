import { ValueObjectError } from './valueObjectError'

export class InvalidShiftTypeTimeError extends ValueObjectError {
  constructor(message: string) {
    super(message)
  }
}

/**
 * シフトタイプの時刻を表す値オブジェクト
 * "HH:mm" 形式（24時間制）の文字列で時刻を保持する
 */
export class ShiftTypeTime {
  readonly value: string

  private static readonly TIME_PATTERN = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/

  constructor(value: string) {
    if (!ShiftTypeTime.TIME_PATTERN.test(value)) {
      throw new InvalidShiftTypeTimeError(
        'Shift Type Time must be in "HH:mm" format (24-hour clock)'
      )
    }
    this.value = value
  }

  /**
   * 時刻を分単位で取得（0:00からの経過分数）
   */
  toMinutes(): number {
    const [hours, minutes] = this.value.split(':').map(Number)
    return hours * 60 + minutes
  }
}
