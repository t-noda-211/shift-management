import {
  ShiftAssignmentDate,
  InvalidShiftAssignmentDateError,
} from './shiftAssignmentDate'

describe('ShiftAssignmentDate', () => {
  describe('constructor', () => {
    it('正常な日付を作成できる', () => {
      const date = new ShiftAssignmentDate('2024-01-15')

      expect(date.value).toBe('2024-01-15')
    })

    it('うるう年の2月29日を作成できる', () => {
      const date = new ShiftAssignmentDate('2024-02-29')

      expect(date.value).toBe('2024-02-29')
    })

    it('"YYYY-MM-DD" 形式以外の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftAssignmentDate('2024/01/15')
      }).toThrow(InvalidShiftAssignmentDateError)

      expect(() => {
        new ShiftAssignmentDate('24-01-15')
      }).toThrow(InvalidShiftAssignmentDateError)

      expect(() => {
        new ShiftAssignmentDate('2024-1-15')
      }).toThrow(InvalidShiftAssignmentDateError)

      expect(() => {
        new ShiftAssignmentDate('2024-01-5')
      }).toThrow(InvalidShiftAssignmentDateError)

      expect(() => {
        new ShiftAssignmentDate('20240115')
      }).toThrow(InvalidShiftAssignmentDateError)
    })

    it('無効な月（13月以上）の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftAssignmentDate('2024-13-01')
      }).toThrow(InvalidShiftAssignmentDateError)

      expect(() => {
        new ShiftAssignmentDate('2024-00-01')
      }).toThrow(InvalidShiftAssignmentDateError)
    })

    it('存在しない日付の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftAssignmentDate('2024-02-30')
      }).toThrow(InvalidShiftAssignmentDateError)

      expect(() => {
        new ShiftAssignmentDate('2024-04-31')
      }).toThrow(InvalidShiftAssignmentDateError)

      expect(() => {
        new ShiftAssignmentDate('2024-06-31')
      }).toThrow(InvalidShiftAssignmentDateError)
    })

    it('平年の2月29日の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftAssignmentDate('2023-02-29')
      }).toThrow(InvalidShiftAssignmentDateError)
    })

    it('日が0の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftAssignmentDate('2024-01-00')
      }).toThrow(InvalidShiftAssignmentDateError)
    })

    it('空文字列の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftAssignmentDate('')
      }).toThrow(InvalidShiftAssignmentDateError)
    })
  })

  describe('toDate', () => {
    it('日付をDateオブジェクトとして取得できる', () => {
      const date = new ShiftAssignmentDate('2024-01-15')
      const dateObj = date.toDate()

      expect(dateObj).toBeInstanceOf(Date)
      expect(dateObj.getFullYear()).toBe(2024)
      expect(dateObj.getMonth()).toBe(0) // 0-indexed (January = 0)
      expect(dateObj.getDate()).toBe(15)
    })

    it('時刻は00:00:00に設定される', () => {
      const date = new ShiftAssignmentDate('2024-01-15')
      const dateObj = date.toDate()

      expect(dateObj.getHours()).toBe(0)
      expect(dateObj.getMinutes()).toBe(0)
      expect(dateObj.getSeconds()).toBe(0)
    })
  })

  describe('getYear', () => {
    it('年を取得できる', () => {
      const date = new ShiftAssignmentDate('2024-01-15')

      expect(date.getYear()).toBe(2024)
    })

    it('異なる年の日付でも正しく年を取得できる', () => {
      const date = new ShiftAssignmentDate('2025-12-31')

      expect(date.getYear()).toBe(2025)
    })
  })

  describe('getMonth', () => {
    it('月を取得できる（1-12の範囲）', () => {
      const date = new ShiftAssignmentDate('2024-01-15')

      expect(date.getMonth()).toBe(1)
    })

    it('12月の場合、12を返す', () => {
      const date = new ShiftAssignmentDate('2024-12-31')

      expect(date.getMonth()).toBe(12)
    })

    it('各月で正しく月を取得できる', () => {
      expect(new ShiftAssignmentDate('2024-01-01').getMonth()).toBe(1)
      expect(new ShiftAssignmentDate('2024-06-15').getMonth()).toBe(6)
      expect(new ShiftAssignmentDate('2024-12-31').getMonth()).toBe(12)
    })
  })

  describe('getDay', () => {
    it('日を取得できる', () => {
      const date = new ShiftAssignmentDate('2024-01-15')

      expect(date.getDay()).toBe(15)
    })

    it('月初めの日を取得できる', () => {
      const date = new ShiftAssignmentDate('2024-01-01')

      expect(date.getDay()).toBe(1)
    })

    it('月末の日を取得できる', () => {
      const date = new ShiftAssignmentDate('2024-01-31')

      expect(date.getDay()).toBe(31)
    })

    it('うるう年の2月29日を取得できる', () => {
      const date = new ShiftAssignmentDate('2024-02-29')

      expect(date.getDay()).toBe(29)
    })
  })
})
