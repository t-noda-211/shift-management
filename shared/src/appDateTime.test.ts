import { Temporal } from '@js-temporal/polyfill'
import { AppDateTime, InvalidAppDateTimeError } from './appDateTime'

// 固定の日時を使用するためのモック
let mockNowInstant: ReturnType<typeof Temporal.Instant.from> =
  Temporal.Instant.from('2026-06-15T12:00:00Z')
jest.mock('@js-temporal/polyfill', () => {
  const actual = jest.requireActual<typeof import('@js-temporal/polyfill')>(
    '@js-temporal/polyfill'
  )
  return {
    ...actual,
    Temporal: {
      ...actual.Temporal,
      Now: {
        ...actual.Temporal.Now,
        instant: () => mockNowInstant,
      },
    },
  }
})

describe('AppDateTime', () => {
  describe('now', () => {
    it('現在日時を表す AppDateTime を返す', () => {
      const result = AppDateTime.now()
      expect(result).toBeInstanceOf(AppDateTime)
      expect(result.value.toString()).toBe('2026-06-15T12:00:00Z')
      expect(result.toJstString()).toBe('2026-06-15T21:00:00+09:00')
      expect(result.toUtcString()).toBe('2026-06-15T12:00:00Z')
    })
  })

  describe('from', () => {
    it('年・月のみで指定すると日は1日、時刻は0時0分0秒になる', () => {
      const dt = AppDateTime.from(2026, 7)
      expect(dt.toJstString()).toBe('2026-07-01T00:00:00+09:00')
      expect(dt.toUtcString()).toBe('2026-06-30T15:00:00Z')
    })

    it('年・月・日を指定できる', () => {
      const dt = AppDateTime.from(2026, 2, 15)
      expect(dt.toJstString()).toBe('2026-02-15T00:00:00+09:00')
      expect(dt.toUtcString()).toBe('2026-02-14T15:00:00Z')
    })

    it('年・月・日・時・分・秒をすべて指定できる', () => {
      const dt = AppDateTime.from(2026, 2, 4, 14, 30, 45)
      expect(dt.toJstString()).toBe('2026-02-04T14:30:45+09:00')
      expect(dt.toUtcString()).toBe('2026-02-04T05:30:45Z')
    })

    it('無効な日付（月が0）のとき InvalidAppDateTimeError を投げる', () => {
      expect(() => AppDateTime.from(2026, 0, 1)).toThrow(
        InvalidAppDateTimeError
      )
    })

    it('無効な日付（日が0）のとき InvalidAppDateTimeError を投げる', () => {
      expect(() => AppDateTime.from(2026, 1, 0)).toThrow(
        InvalidAppDateTimeError
      )
    })

    it('無効な日付（NaN など不正な値で Temporal が例外を投げる）とき InvalidAppDateTimeError を投げる', () => {
      expect(() => AppDateTime.from(NaN, 1, 1)).toThrow(InvalidAppDateTimeError)
    })
  })

  describe('equals', () => {
    it('同じ日時の場合、trueを返す', () => {
      const dt = AppDateTime.from(2026, 2, 4, 14, 30, 45)
      expect(dt.equals(AppDateTime.from(2026, 2, 4, 14, 30, 45))).toBe(true)
    })
  })

  describe('isAfter', () => {
    it('指定された日時より後の場合、trueを返す', () => {
      const dt = AppDateTime.from(2026, 2, 4, 14, 30, 45)
      expect(dt.isAfter(AppDateTime.from(2026, 2, 4, 14, 30, 44))).toBe(true)
    })
  })

  describe('isBefore', () => {
    it('指定された日時より前の場合、trueを返す', () => {
      const dt = AppDateTime.from(2026, 2, 4, 14, 30, 45)
      expect(dt.isBefore(AppDateTime.from(2026, 2, 4, 14, 30, 46))).toBe(true)
    })
  })
})
