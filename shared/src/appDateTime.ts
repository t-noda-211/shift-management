import { Temporal } from '@js-temporal/polyfill'
import { SharedError } from './sharedError'

export class InvalidAppDateTimeError extends SharedError {
  constructor() {
    super('Invalid AppDateTime')
  }
}

/**
 * アプリ全体で使う日時クラス
 * Temporal.Instant で日時を保持する
 * 特殊な操作をするためにvalueを公開しているが、基本的にはvalueを使用せずにメソッド経由で使用すること
 * そのために、複数箇所で使用する可能性がある場合はメソッドを作成する
 *
 * @example
 * const now = AppDateTime.now()
 * const jst = now.toJstString()
 * const utc = now.toUtcString()
 * const year = now.year
 * const month = now.month
 * const day = now.day
 * const hour = now.hour
 * const minute = now.minute
 */
export class AppDateTime {
  private constructor(readonly value: Temporal.Instant) {}

  /**
   * 現在日時を取得する
   */
  static now(): AppDateTime {
    return new AppDateTime(Temporal.Now.instant())
  }

  /**
   * 指定された年月日時分秒で日時を作成する
   * 日本時間（Asia/Tokyo）での日時を指定する
   * 年と月は必須、日と時刻は省略可能
   * @param year 年
   * @param month 月
   * @param day 日 デフォルトは1日
   * @param hour 時 デフォルトは0時
   * @param minute 分 デフォルトは0分
   * @param second 秒 デフォルトは0秒
   * @returns AppDateTime
   */
  static from(
    year: number,
    month: number,
    day?: number,
    hour?: number,
    minute?: number,
    second?: number
  ): AppDateTime {
    try {
      return new AppDateTime(
        Temporal.ZonedDateTime.from({
          timeZone: 'Asia/Tokyo',
          year,
          month,
          day: day ?? 1,
          hour: hour ?? 0,
          minute: minute ?? 0,
          second: second ?? 0,
        }).toInstant()
      )
    } catch (error) {
      throw new InvalidAppDateTimeError()
    }
  }

  private toZonedDateTimeISOJst(): Temporal.ZonedDateTime {
    return this.value.toZonedDateTimeISO('Asia/Tokyo')
  }

  /**
   * JST（日本標準時）での日時を ISO 8601 形式の文字列で返す
   * フォーマット例: 2026-06-15T21:00:00+09:00
   */
  toJstString(): string {
    const jst = this.toZonedDateTimeISOJst()
    return `${jst.toPlainDateTime().toString()}${jst.offset}`
  }

  /**
   * UTC での日時を ISO 8601 形式の文字列で返す
   * フォーマット例: 2026-06-15T12:00:00Z
   */
  toUtcString(): string {
    return this.value.toString()
  }

  get year(): number {
    return this.toZonedDateTimeISOJst().year
  }

  get month(): number {
    return this.toZonedDateTimeISOJst().month
  }

  get day(): number {
    return this.toZonedDateTimeISOJst().day
  }

  get hour(): number {
    return this.toZonedDateTimeISOJst().hour
  }

  get minute(): number {
    return this.toZonedDateTimeISOJst().minute
  }

  get second(): number {
    return this.toZonedDateTimeISOJst().second
  }

  /**
   * 指定された日時と等しいかどうかを判定する
   * @param other 比較対象の日時
   * @returns 等しい場合はtrue、異なる場合はfalse
   */
  equals(other: AppDateTime): boolean {
    return Temporal.Instant.compare(this.value, other.value) === 0
  }

  /**
   * 指定された日時より後かどうかを判定する
   * @param other 比較対象の日時
   * @returns 後の場合はtrue、前の場合はfalse
   */
  isAfter(other: AppDateTime): boolean {
    return Temporal.Instant.compare(this.value, other.value) > 0
  }

  /**
   * 指定された日時より前かどうかを判定する
   * @param other 比較対象の日時
   * @returns 前の場合はtrue、後の場合はfalse
   */
  isBefore(other: AppDateTime): boolean {
    return Temporal.Instant.compare(this.value, other.value) < 0
  }
}
