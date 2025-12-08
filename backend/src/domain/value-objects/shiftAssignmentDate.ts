import { ValueObjectError } from './valueObjectError'

export class InvalidShiftAssignmentDateError extends ValueObjectError {
  constructor(message: string) {
    super(message)
  }
}

/**
 * シフトアサインの日付を表す値オブジェクト
 * "YYYY-MM-DD" 形式の文字列で日付を保持する
 */
export class ShiftAssignmentDate {
  readonly value: string

  private static readonly DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

  constructor(value: string) {
    if (!ShiftAssignmentDate.DATE_PATTERN.test(value)) {
      throw new InvalidShiftAssignmentDateError(
        'Shift Assignment Date must be in "YYYY-MM-DD" format'
      )
    }

    // 有効な日付かどうかを検証
    const date = new Date(value + 'T00:00:00')
    if (isNaN(date.getTime())) {
      throw new InvalidShiftAssignmentDateError(
        'Shift Assignment Date must be a valid date'
      )
    }

    // 入力された日付が正しく解釈されているか確認
    const [year, month, day] = value.split('-').map(Number)
    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      throw new InvalidShiftAssignmentDateError(
        'Shift Assignment Date must be a valid date'
      )
    }

    this.value = value
  }

  /**
   * 日付をDateオブジェクトとして取得
   */
  toDate(): Date {
    return new Date(this.value + 'T00:00:00')
  }

  /**
   * 年を取得
   */
  getYear(): number {
    return this.toDate().getFullYear()
  }

  /**
   * 月を取得（1-12）
   */
  getMonth(): number {
    return this.toDate().getMonth() + 1
  }

  /**
   * 日を取得
   */
  getDay(): number {
    return this.toDate().getDate()
  }
}
