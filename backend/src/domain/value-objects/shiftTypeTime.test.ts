import { ShiftTypeTime, InvalidShiftTypeTimeError } from './shiftTypeTime'

describe('ShiftTypeTime', () => {
  describe('constructor', () => {
    it('正常な時刻 "HH:mm" 形式を作成できる', () => {
      const time = new ShiftTypeTime('09:00')

      expect(time.value).toBe('09:00')
    })

    it('00:00を作成できる', () => {
      const time = new ShiftTypeTime('00:00')

      expect(time.value).toBe('00:00')
    })

    it('23:59を作成できる', () => {
      const time = new ShiftTypeTime('23:59')

      expect(time.value).toBe('23:59')
    })

    it('"HH:mm" 形式以外の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftTypeTime('9:00')
      }).toThrow(InvalidShiftTypeTimeError)

      expect(() => {
        new ShiftTypeTime('09:0')
      }).toThrow(InvalidShiftTypeTimeError)

      expect(() => {
        new ShiftTypeTime('9:0')
      }).toThrow(InvalidShiftTypeTimeError)

      expect(() => {
        new ShiftTypeTime('0900')
      }).toThrow(InvalidShiftTypeTimeError)

      expect(() => {
        new ShiftTypeTime('09-00')
      }).toThrow(InvalidShiftTypeTimeError)
    })

    it('無効な時間（24時以上）の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftTypeTime('24:00')
      }).toThrow(InvalidShiftTypeTimeError)

      expect(() => {
        new ShiftTypeTime('25:00')
      }).toThrow(InvalidShiftTypeTimeError)
    })

    it('無効な分（60分以上）の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftTypeTime('09:60')
      }).toThrow(InvalidShiftTypeTimeError)

      expect(() => {
        new ShiftTypeTime('09:99')
      }).toThrow(InvalidShiftTypeTimeError)
    })

    it('空文字列の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftTypeTime('')
      }).toThrow(InvalidShiftTypeTimeError)
    })
  })

  describe('toMinutes', () => {
    it('00:00を分単位で取得できる', () => {
      const time = new ShiftTypeTime('00:00')

      expect(time.toMinutes()).toBe(0)
    })

    it('09:00を分単位で取得できる', () => {
      const time = new ShiftTypeTime('09:00')

      expect(time.toMinutes()).toBe(540)
    })

    it('12:30を分単位で取得できる', () => {
      const time = new ShiftTypeTime('12:30')

      expect(time.toMinutes()).toBe(750)
    })

    it('18:45を分単位で取得できる', () => {
      const time = new ShiftTypeTime('18:45')

      expect(time.toMinutes()).toBe(1125)
    })

    it('23:59を分単位で取得できる', () => {
      const time = new ShiftTypeTime('23:59')

      expect(time.toMinutes()).toBe(1439)
    })
  })
})
