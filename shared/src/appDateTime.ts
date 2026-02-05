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

  /**
   * JST（日本標準時）での日時を ISO 8601 形式の文字列で返す
   * フォーマット例: 2026-06-15T21:00:00+09:00
   */
  toJstString(): string {
    const jst = this.value.toZonedDateTimeISO('Asia/Tokyo')
    return `${jst.toPlainDateTime().toString()}${jst.offset}`
  }

  /**
   * UTC での日時を ISO 8601 形式の文字列で返す
   * フォーマット例: 2026-06-15T12:00:00Z
   */
  toUtcString(): string {
    return this.value.toString()
  }
}
