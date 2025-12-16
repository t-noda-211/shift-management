import { WorkSummary, InvalidWorkSummaryError } from './workSummary'

describe('WorkSummary', () => {
  describe('constructor', () => {
    it('正常な値でインスタンスを作成できる', () => {
      const dayCountByShiftType = { 早番: 5, 遅番: 3 }
      const dayCountByTimeOffType = { 公休: 2, 有給: 1 }

      const workSummary = new WorkSummary(
        dayCountByShiftType,
        dayCountByTimeOffType
      )

      expect(workSummary.dayCountByShiftType).toEqual(dayCountByShiftType)
      expect(workSummary.totalWorkDayCount).toBe(8)
      expect(workSummary.dayCountByTimeOffType).toEqual(dayCountByTimeOffType)
      expect(workSummary.totalTimeOffDayCount).toBe(3)
    })

    it('空のマップでもインスタンスを作成できる', () => {
      const workSummary = new WorkSummary({}, {})

      expect(workSummary.dayCountByShiftType).toEqual({})
      expect(workSummary.totalWorkDayCount).toBe(0)
      expect(workSummary.dayCountByTimeOffType).toEqual({})
      expect(workSummary.totalTimeOffDayCount).toBe(0)
    })

    it('totalWorkDayCountが自動計算される', () => {
      const dayCountByShiftType = { 早番: 5, 遅番: 3, 夜勤: 2 }
      const workSummary = new WorkSummary(dayCountByShiftType, {})

      expect(workSummary.totalWorkDayCount).toBe(10)
    })

    it('totalTimeOffDayCountが自動計算される', () => {
      const dayCountByTimeOffType = { 公休: 2, 有給: 1, 病休: 3 }
      const workSummary = new WorkSummary({}, dayCountByTimeOffType)

      expect(workSummary.totalTimeOffDayCount).toBe(6)
    })

    it('dayCountByShiftTypeに負の値が含まれる場合、エラーを投げる', () => {
      expect(() => {
        new WorkSummary({ 早番: -1 }, {})
      }).toThrow(InvalidWorkSummaryError)
    })

    it('dayCountByShiftTypeに複数の負の値が含まれる場合、エラーを投げる', () => {
      expect(() => {
        new WorkSummary({ 早番: 5, 遅番: -3 }, {})
      }).toThrow(InvalidWorkSummaryError)
    })

    it('dayCountByTimeOffTypeに負の値が含まれる場合、エラーを投げる', () => {
      expect(() => {
        new WorkSummary({}, { 公休: -1 })
      }).toThrow(InvalidWorkSummaryError)
    })

    it('dayCountByTimeOffTypeに複数の負の値が含まれる場合、エラーを投げる', () => {
      expect(() => {
        new WorkSummary({}, { 公休: 2, 有給: -1 })
      }).toThrow(InvalidWorkSummaryError)
    })

    it('0の値は許可される', () => {
      const workSummary = new WorkSummary({ 早番: 0 }, { 公休: 0 })

      expect(workSummary.dayCountByShiftType).toEqual({ 早番: 0 })
      expect(workSummary.totalWorkDayCount).toBe(0)
      expect(workSummary.dayCountByTimeOffType).toEqual({ 公休: 0 })
      expect(workSummary.totalTimeOffDayCount).toBe(0)
    })
  })

  describe('equals', () => {
    it('同じ値を持つインスタンスは等価と判定される', () => {
      const dayCountByShiftType = { 早番: 5, 遅番: 3 }
      const dayCountByTimeOffType = { 公休: 2, 有給: 1 }

      const workSummary1 = new WorkSummary(
        dayCountByShiftType,
        dayCountByTimeOffType
      )
      const workSummary2 = new WorkSummary(
        dayCountByShiftType,
        dayCountByTimeOffType
      )

      expect(workSummary1.equals(workSummary2)).toBe(true)
    })

    it('同じインスタンスは等価と判定される', () => {
      const workSummary = new WorkSummary({ 早番: 5 }, {})

      expect(workSummary.equals(workSummary)).toBe(true)
    })

    it('totalWorkDayCountが異なる場合、等価でないと判定される', () => {
      const workSummary1 = new WorkSummary({ 早番: 5 }, {})
      const workSummary2 = new WorkSummary({ 早番: 6 }, {})

      expect(workSummary1.equals(workSummary2)).toBe(false)
    })

    it('totalTimeOffDayCountが異なる場合、等価でないと判定される', () => {
      const workSummary1 = new WorkSummary({}, { 公休: 2 })
      const workSummary2 = new WorkSummary({}, { 公休: 3 })

      expect(workSummary1.equals(workSummary2)).toBe(false)
    })

    it('dayCountByShiftTypeのキーが異なる場合、等価でないと判定される', () => {
      const workSummary1 = new WorkSummary({ 早番: 5 }, {})
      const workSummary2 = new WorkSummary({ 遅番: 5 }, {})

      expect(workSummary1.equals(workSummary2)).toBe(false)
    })

    it('dayCountByShiftTypeの値が異なる場合、等価でないと判定される', () => {
      const workSummary1 = new WorkSummary({ 早番: 5 }, {})
      const workSummary2 = new WorkSummary({ 早番: 6 }, {})

      expect(workSummary1.equals(workSummary2)).toBe(false)
    })

    it('dayCountByTimeOffTypeのキーが異なる場合、等価でないと判定される', () => {
      const workSummary1 = new WorkSummary({}, { 公休: 2 })
      const workSummary2 = new WorkSummary({}, { 有給: 2 })

      expect(workSummary1.equals(workSummary2)).toBe(false)
    })

    it('dayCountByTimeOffTypeの値が異なる場合、等価でないと判定される', () => {
      const workSummary1 = new WorkSummary({}, { 公休: 2 })
      const workSummary2 = new WorkSummary({}, { 公休: 3 })

      expect(workSummary1.equals(workSummary2)).toBe(false)
    })

    it('マップのキーの順序が異なっても、内容が同じなら等価と判定される', () => {
      const workSummary1 = new WorkSummary(
        { 早番: 5, 遅番: 3 },
        { 公休: 2, 有給: 1 }
      )
      const workSummary2 = new WorkSummary(
        { 遅番: 3, 早番: 5 },
        { 有給: 1, 公休: 2 }
      )

      expect(workSummary1.equals(workSummary2)).toBe(true)
    })
  })
})
