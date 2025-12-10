import { Temporal } from '@js-temporal/polyfill'
import { UpdatedAt, InvalidUpdatedAtError } from './updatedAt'

describe('UpdatedAt', () => {
  describe('constructor', () => {
    it('正常なISO 8601文字列からUpdatedAtを作成できる', () => {
      const updatedAt = new UpdatedAt('2024-01-15T10:30:00Z')

      expect(updatedAt.value).toBeInstanceOf(Temporal.Instant)
    })

    it('Temporal.ZonedDateTimeからUpdatedAtを作成できる', () => {
      const zonedDateTime = Temporal.ZonedDateTime.from(
        '2024-01-15T10:30:00[UTC]'
      )
      const updatedAt = new UpdatedAt(zonedDateTime)

      expect(updatedAt.value).toBeInstanceOf(Temporal.Instant)
    })

    it('Temporal.InstantからUpdatedAtを作成できる', () => {
      const instant = Temporal.Instant.from('2024-01-15T10:30:00Z')
      const updatedAt = new UpdatedAt(instant)

      expect(updatedAt.value).toBeInstanceOf(Temporal.Instant)
      expect(updatedAt.value).toBe(instant)
    })

    it('無効な文字列の場合、エラーを投げる', () => {
      expect(() => {
        new UpdatedAt('invalid-date')
      }).toThrow(InvalidUpdatedAtError)

      expect(() => {
        new UpdatedAt('2024-01-15')
      }).toThrow(InvalidUpdatedAtError)

      expect(() => {
        new UpdatedAt('2024-13-45T25:70:00Z')
      }).toThrow(InvalidUpdatedAtError)
    })

    it('空文字列の場合、エラーを投げる', () => {
      expect(() => {
        new UpdatedAt('')
      }).toThrow(InvalidUpdatedAtError)
    })
  })

  describe('now', () => {
    it('現在の日時でUpdatedAtを作成できる', () => {
      const before = Temporal.Now.instant()
      const updatedAt = UpdatedAt.now()
      const after = Temporal.Now.instant()

      expect(Temporal.Instant.compare(updatedAt.value, before) >= 0).toBe(true)
      expect(Temporal.Instant.compare(updatedAt.value, after) <= 0).toBe(true)
    })
  })

  describe('update', () => {
    it('現在時刻に更新した新しいUpdatedAtを返す', () => {
      const original = new UpdatedAt('2024-01-15T10:30:00Z')
      const before = Temporal.Now.instant()
      const updated = original.update()
      const after = Temporal.Now.instant()

      // 元のインスタンスは変更されていない
      expect(original.value.toString()).toBe('2024-01-15T10:30:00Z')

      // 新しいインスタンスは現在時刻になっている
      expect(Temporal.Instant.compare(updated.value, before) >= 0).toBe(true)
      expect(Temporal.Instant.compare(updated.value, after) <= 0).toBe(true)

      // 元のインスタンスより後である
      expect(Temporal.Instant.compare(updated.value, original.value) > 0).toBe(
        true
      )
    })
  })

  describe('toString', () => {
    it('ISO 8601形式の文字列として取得できる（JST）', () => {
      // UTC 2024-01-15T10:30:00Z は JST 2024-01-15T19:30:00+09:00
      const updatedAt = new UpdatedAt('2024-01-15T10:30:00Z')
      const jstString = updatedAt.toString()

      // JST形式（Asia/Tokyo）のISO 8601文字列を期待
      expect(jstString).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?\+09:00$/
      )

      // 日時が正しく変換されているか確認
      const plainDateTime = Temporal.PlainDateTime.from(
        jstString.replace(/\+09:00$/, '')
      )
      const zonedDateTime = plainDateTime.toZonedDateTime('Asia/Tokyo')
      expect(zonedDateTime.year).toBe(2024)
      expect(zonedDateTime.month).toBe(1)
      expect(zonedDateTime.day).toBe(15)
      expect(zonedDateTime.hour).toBe(19) // UTC+9時間
      expect(zonedDateTime.minute).toBe(30)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const updatedAt = new UpdatedAt('2024-01-15T10:30:00Z')

      expect(updatedAt.equals(updatedAt)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const updatedAt1 = new UpdatedAt('2024-01-15T10:30:00Z')
      const updatedAt2 = new UpdatedAt('2024-01-15T10:30:00Z')

      expect(updatedAt1.equals(updatedAt2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const updatedAt1 = new UpdatedAt('2024-01-15T10:30:00Z')
      const updatedAt2 = new UpdatedAt('2024-01-16T10:30:00Z')

      expect(updatedAt1.equals(updatedAt2)).toBe(false)
    })
  })
})
