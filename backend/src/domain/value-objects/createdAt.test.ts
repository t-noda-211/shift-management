import { Temporal } from '@js-temporal/polyfill'
import { CreatedAt, InvalidCreatedAtError } from './createdAt'

describe('CreatedAt', () => {
  describe('constructor', () => {
    it('正常なISO 8601文字列からCreatedAtを作成できる', () => {
      const createdAt = new CreatedAt('2024-01-15T10:30:00Z')

      expect(createdAt.value).toBeInstanceOf(Temporal.Instant)
    })

    it('Temporal.ZonedDateTimeからCreatedAtを作成できる', () => {
      const zonedDateTime = Temporal.ZonedDateTime.from(
        '2024-01-15T10:30:00[UTC]'
      )
      const createdAt = new CreatedAt(zonedDateTime)

      expect(createdAt.value).toBeInstanceOf(Temporal.Instant)
    })

    it('Temporal.InstantからCreatedAtを作成できる', () => {
      const instant = Temporal.Instant.from('2024-01-15T10:30:00Z')
      const createdAt = new CreatedAt(instant)

      expect(createdAt.value).toBeInstanceOf(Temporal.Instant)
      expect(createdAt.value).toBe(instant)
    })

    it('無効な文字列の場合、エラーを投げる', () => {
      expect(() => {
        new CreatedAt('invalid-date')
      }).toThrow(InvalidCreatedAtError)

      expect(() => {
        new CreatedAt('2024-01-15')
      }).toThrow(InvalidCreatedAtError)

      expect(() => {
        new CreatedAt('2024-13-45T25:70:00Z')
      }).toThrow(InvalidCreatedAtError)
    })

    it('空文字列の場合、エラーを投げる', () => {
      expect(() => {
        new CreatedAt('')
      }).toThrow(InvalidCreatedAtError)
    })
  })

  describe('now', () => {
    it('現在の日時でCreatedAtを作成できる', () => {
      const before = Temporal.Now.instant()
      const createdAt = CreatedAt.now()
      const after = Temporal.Now.instant()

      expect(Temporal.Instant.compare(createdAt.value, before) >= 0).toBe(true)
      expect(Temporal.Instant.compare(createdAt.value, after) <= 0).toBe(true)
    })
  })

  describe('toString', () => {
    it('ISO 8601形式の文字列として取得できる（JST）', () => {
      // UTC 2024-01-15T10:30:00Z は JST 2024-01-15T19:30:00+09:00
      const createdAt = new CreatedAt('2024-01-15T10:30:00Z')
      const jstString = createdAt.toString()

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
      const createdAt = new CreatedAt('2024-01-15T10:30:00Z')

      expect(createdAt.equals(createdAt)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const createdAt1 = new CreatedAt('2024-01-15T10:30:00Z')
      const createdAt2 = new CreatedAt('2024-01-15T10:30:00Z')

      expect(createdAt1.equals(createdAt2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const createdAt1 = new CreatedAt('2024-01-15T10:30:00Z')
      const createdAt2 = new CreatedAt('2024-01-16T10:30:00Z')

      expect(createdAt1.equals(createdAt2)).toBe(false)
    })
  })
})
