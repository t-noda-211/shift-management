import type { ValueObject } from './valueObject'
import { DomainValidationError } from '../errors'

/**
 * シフト通知のタイトルを表す値オブジェクト
 */
export class ShiftNoticeTitle implements ValueObject {
  readonly value: string

  static readonly MAX_LENGTH = 50

  constructor(value: string) {
    if (value.length < 1 || value.length > ShiftNoticeTitle.MAX_LENGTH) {
      throw new DomainValidationError(
        `Shift Notice Title must be between 1 and ${ShiftNoticeTitle.MAX_LENGTH} characters`
      )
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
