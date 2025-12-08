import { TimeOffType, InvalidTimeOffTypeError } from './timeOffType'

describe('TimeOffType', () => {
  describe('from', () => {
    it('有効なコード "PUBLIC_HOLIDAY" からインスタンスを生成できる', () => {
      const timeOffType = TimeOffType.from('PUBLIC_HOLIDAY')

      expect(timeOffType.code).toBe('PUBLIC_HOLIDAY')
      expect(timeOffType.name).toBe('公休')
    })

    it('有効なコード "PAID_LEAVE" からインスタンスを生成できる', () => {
      const timeOffType = TimeOffType.from('PAID_LEAVE')

      expect(timeOffType.code).toBe('PAID_LEAVE')
      expect(timeOffType.name).toBe('有給')
    })

    it('無効なコードの場合、エラーを投げる', () => {
      expect(() => {
        TimeOffType.from('INVALID')
      }).toThrow(InvalidTimeOffTypeError)

      expect(() => {
        TimeOffType.from('public_holiday')
      }).toThrow(InvalidTimeOffTypeError)

      expect(() => {
        TimeOffType.from('')
      }).toThrow(InvalidTimeOffTypeError)
    })
  })

  describe('publicHoliday', () => {
    it('公休のインスタンスを作成できる', () => {
      const timeOffType = TimeOffType.publicHoliday()

      expect(timeOffType.code).toBe('PUBLIC_HOLIDAY')
      expect(timeOffType.name).toBe('公休')
    })
  })

  describe('paidLeave', () => {
    it('有給のインスタンスを作成できる', () => {
      const timeOffType = TimeOffType.paidLeave()

      expect(timeOffType.code).toBe('PAID_LEAVE')
      expect(timeOffType.name).toBe('有給')
    })
  })

  describe('isPublicHoliday', () => {
    it('公休の場合、trueを返す', () => {
      const timeOffType = TimeOffType.publicHoliday()

      expect(timeOffType.isPublicHoliday()).toBe(true)
    })

    it('有給の場合、falseを返す', () => {
      const timeOffType = TimeOffType.paidLeave()

      expect(timeOffType.isPublicHoliday()).toBe(false)
    })
  })

  describe('isPaidLeave', () => {
    it('有給の場合、trueを返す', () => {
      const timeOffType = TimeOffType.paidLeave()

      expect(timeOffType.isPaidLeave()).toBe(true)
    })

    it('公休の場合、falseを返す', () => {
      const timeOffType = TimeOffType.publicHoliday()

      expect(timeOffType.isPaidLeave()).toBe(false)
    })
  })
})
