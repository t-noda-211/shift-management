import type { ValueObject } from './valueObject'
import { DomainValidationError } from '../errors'

/**
 * シフト通知の内容を表す値オブジェクト
 */
export class ShiftNoticeContent implements ValueObject {
  readonly value: string

  static readonly MAX_LENGTH = 500

  constructor(value: string) {
    if (value.length < 1 || value.length > ShiftNoticeContent.MAX_LENGTH) {
      throw new DomainValidationError(
        `Shift Notice Content must be between 1 and ${ShiftNoticeContent.MAX_LENGTH} characters`
      )
    }
    this.value = value
  }

  equals(other: ShiftNoticeContent): boolean {
    if (this === other) {
      return true
    }

    return this.value === other.value
  }
}
