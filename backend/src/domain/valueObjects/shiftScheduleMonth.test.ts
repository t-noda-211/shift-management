import {
  ShiftScheduleMonth,
  InvalidShiftScheduleMonthError,
} from './shiftScheduleMonth'

describe('ShiftScheduleMonth', () => {
  describe('constructor', () => {
    it('正常な月を作成できる', () => {
      const month = new ShiftScheduleMonth(1)

      expect(month.value).toBe(1)
    })

    it('最小月（1）を作成できる', () => {
      const month = new ShiftScheduleMonth(1)

      expect(month.value).toBe(1)
    })

    it('最大月（12）を作成できる', () => {
      const month = new ShiftScheduleMonth(12)

      expect(month.value).toBe(12)
    })

    it('最小月未満の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftScheduleMonth(0)
      }).toThrow(InvalidShiftScheduleMonthError)
    })

    it('最大月を超える場合、エラーを投げる', () => {
      expect(() => {
        new ShiftScheduleMonth(13)
      }).toThrow(InvalidShiftScheduleMonthError)
    })

    it('整数でない場合、エラーを投げる', () => {
      expect(() => {
        new ShiftScheduleMonth(1.5)
      }).toThrow(InvalidShiftScheduleMonthError)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const month = new ShiftScheduleMonth(1)

      expect(month.equals(month)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const month1 = new ShiftScheduleMonth(1)
      const month2 = new ShiftScheduleMonth(1)

      expect(month1.equals(month2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const month1 = new ShiftScheduleMonth(1)
      const month2 = new ShiftScheduleMonth(2)

      expect(month1.equals(month2)).toBe(false)
    })
  })
})
