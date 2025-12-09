import { Temporal } from '@js-temporal/polyfill'
import { ValueObjectError } from './valueObjectError'

export class InvalidUpdatedAtError extends ValueObjectError {
  constructor(message: string) {
    super(message)
  }
}

/**
 * 更新日時を表す値オブジェクト
 * Temporal.Instantで日時を保持する（UTC）
 */
export class UpdatedAt {
  readonly value: Temporal.Instant

  constructor(value: string | Temporal.ZonedDateTime | Temporal.Instant) {
    let instant: Temporal.Instant

    if (typeof value === 'string') {
      try {
        // ISO 8601文字列からInstantを作成
        instant = Temporal.Instant.from(value)
      } catch (error) {
        throw new InvalidUpdatedAtError(
          'UpdatedAt must be a valid ISO 8601 datetime string'
        )
      }
    } else if (value instanceof Temporal.ZonedDateTime) {
      instant = value.toInstant()
    } else if (value instanceof Temporal.Instant) {
      instant = value
    } else {
      throw new InvalidUpdatedAtError('UpdatedAt must be a valid datetime')
    }

    this.value = instant
  }

  /**
   * 現在の日時でUpdatedAtを作成
   */
  static now(): UpdatedAt {
    const now = Temporal.Now.instant()
    return new UpdatedAt(now)
  }

  /**
   * 現在時刻に更新した新しいUpdatedAtを返す
   */
  update(): UpdatedAt {
    return new UpdatedAt(Temporal.Now.instant())
  }

  /**
   * ISO 8601形式の文字列として取得（JST）
   */
  toString(): string {
    const zonedDateTime = this.value.toZonedDateTimeISO('Asia/Tokyo')
    // ISO 8601形式: YYYY-MM-DDTHH:mm:ss+09:00
    return `${zonedDateTime.year.toString().padStart(4, '0')}-${zonedDateTime.month
      .toString()
      .padStart(
        2,
        '0'
      )}-${zonedDateTime.day.toString().padStart(2, '0')}T${zonedDateTime.hour
      .toString()
      .padStart(
        2,
        '0'
      )}:${zonedDateTime.minute.toString().padStart(2, '0')}:${zonedDateTime.second
      .toString()
      .padStart(2, '0')}${zonedDateTime.offset}`
  }
}
