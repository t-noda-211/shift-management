import { ValueObjectError } from './valueObjectError'
import type { ValueObject } from './valueObject'

export class InvalidShiftNoticeTitleError extends ValueObjectError {
  constructor() {
    super(
      `Shift Notice Title must be between 1 and ${ShiftNoticeTitle.MAX_LENGTH} characters`
    )
  }
}

/**
 * シフト通知のタイトルを表す値オブジェクト
 */
export class ShiftNoticeTitle implements ValueObject {
  readonly value: string

  static readonly MAX_LENGTH = 50

  constructor(value: string) {
    if (value.length < 1 || value.length > ShiftNoticeTitle.MAX_LENGTH) {
      throw new InvalidShiftNoticeTitleError()
    }
    this.value = value
  }

  equals(other: ShiftNoticeTitle): boolean {
    if (this === other) {
      return true
    }

    return this.value === other.value
  }
}
