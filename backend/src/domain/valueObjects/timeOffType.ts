import type { ValueObject } from './valueObject'
import { ValueObjectError } from './valueObjectError'

/**
 * 休暇種別の表示名の型
 */
export type TimeOffTypeName = '公休' | '有給'

/**
 * 休暇種別のコードの型
 */
export type TimeOffTypeCode = 'PUBLIC_HOLIDAY' | 'PAID_LEAVE'

export class InvalidTimeOffTypeError extends ValueObjectError {
  constructor() {
    super('Time Off Type code must be either "PUBLIC_HOLIDAY" or "PAID_LEAVE"')
  }
}

/**
 * 休暇種別の値オブジェクト
 * 公休または有給のいずれかを表す
 */
export class TimeOffType implements ValueObject {
  readonly code: TimeOffTypeCode
  readonly name: TimeOffTypeName

  private static readonly CODE_TO_VALUE: Record<
    TimeOffTypeCode,
    TimeOffTypeName
  > = {
    PUBLIC_HOLIDAY: '公休',
    PAID_LEAVE: '有給',
  } as const

  private static readonly VALID_CODES = [
    'PUBLIC_HOLIDAY',
    'PAID_LEAVE',
  ] as const

  private constructor(code: TimeOffTypeCode) {
    this.code = code
    this.name = TimeOffType.CODE_TO_VALUE[code]
  }

  /**
   * コード（大文字英数字）からインスタンスを生成
   * @param code 休暇種別のコード（"PUBLIC_HOLIDAY" または "PAID_LEAVE"）
   * @returns TimeOffType インスタンス
   * @throws InvalidTimeOffTypeError 無効なコードが指定された場合
   */
  static from(code: string): TimeOffType {
    if (!TimeOffType.VALID_CODES.includes(code as TimeOffTypeCode)) {
      throw new InvalidTimeOffTypeError()
    }
    return new TimeOffType(code as TimeOffTypeCode)
  }

  /**
   * 公休のインスタンスを作成
   */
  static publicHoliday(): TimeOffType {
    return new TimeOffType('PUBLIC_HOLIDAY')
  }

  /**
   * 有給のインスタンスを作成
   */
  static paidLeave(): TimeOffType {
    return new TimeOffType('PAID_LEAVE')
  }

  /**
   * 公休かどうかを判定
   */
  isPublicHoliday(): boolean {
    return this.code === 'PUBLIC_HOLIDAY'
  }

  /**
   * 有給かどうかを判定
   */
  isPaidLeave(): boolean {
    return this.code === 'PAID_LEAVE'
  }

  equals(other: TimeOffType): boolean {
    if (this === other) {
      return true
    }

    return this.code === other.code && this.name === other.name
  }
}
