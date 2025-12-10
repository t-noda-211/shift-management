import { Temporal } from '@js-temporal/polyfill'
import { ValueObjectError } from './valueObjectError'
import type { ValueObject } from './valueObject'

export class InvalidCreatedAtError extends ValueObjectError {
  constructor(message: string) {
    super(message)
  }
}

/**
 * 作成日時を表す値オブジェクト
 * Temporal.Instantで日時を保持する（UTC）
 */
export class CreatedAt implements ValueObject {
  readonly value: Temporal.Instant

  constructor(value: string | Temporal.ZonedDateTime | Temporal.Instant) {
    let instant: Temporal.Instant

    if (typeof value === 'string') {
      try {
        // ISO 8601文字列からInstantを作成
        instant = Temporal.Instant.from(value)
      } catch (error) {
        throw new InvalidCreatedAtError(
          'CreatedAt must be a valid ISO 8601 datetime string'
        )
      }
    } else if (value instanceof Temporal.ZonedDateTime) {
      instant = value.toInstant()
    } else if (value instanceof Temporal.Instant) {
      instant = value
    } else {
      throw new InvalidCreatedAtError('CreatedAt must be a valid datetime')
    }

    this.value = instant
  }

  /**
   * 現在の日時でCreatedAtを作成
   */
  static now(): CreatedAt {
    const now = Temporal.Now.instant()
    return new CreatedAt(now)
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

  equals(other: CreatedAt): boolean {
    if (this === other) {
      return true
    }

    return Temporal.Instant.compare(this.value, other.value) === 0
  }
}
