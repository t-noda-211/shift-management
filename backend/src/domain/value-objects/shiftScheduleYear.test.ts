import {
  ShiftScheduleYear,
  InvalidShiftScheduleYearError,
} from './shiftScheduleYear'

describe('ShiftScheduleYear', () => {
  describe('constructor', () => {
    it('正常な年を作成できる', () => {
      const year = new ShiftScheduleYear(2026)

      expect(year.value).toBe(2026)
    })

    it('最小年（2026）を作成できる', () => {
      const year = new ShiftScheduleYear(2026)

      expect(year.value).toBe(2026)
    })

    it('最大年（2100）を作成できる', () => {
      const year = new ShiftScheduleYear(2100)

      expect(year.value).toBe(2100)
    })

    it('最小年未満の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftScheduleYear(2025)
      }).toThrow(InvalidShiftScheduleYearError)
    })

    it('最大年を超える場合、エラーを投げる', () => {
      expect(() => {
        new ShiftScheduleYear(2101)
      }).toThrow(InvalidShiftScheduleYearError)
    })

    it('整数でない場合、エラーを投げる', () => {
      expect(() => {
        new ShiftScheduleYear(2026.5)
      }).toThrow(InvalidShiftScheduleYearError)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const year = new ShiftScheduleYear(2026)

      expect(year.equals(year)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const year1 = new ShiftScheduleYear(2026)
      const year2 = new ShiftScheduleYear(2026)

      expect(year1.equals(year2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const year1 = new ShiftScheduleYear(2026)
      const year2 = new ShiftScheduleYear(2027)

      expect(year1.equals(year2)).toBe(false)
    })
  })
})
