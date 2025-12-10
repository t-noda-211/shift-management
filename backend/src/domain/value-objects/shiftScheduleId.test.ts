import { ShiftScheduleId, InvalidShiftScheduleIdError } from './shiftScheduleId'

describe('ShiftScheduleId', () => {
  describe('create', () => {
    it('新しいShiftScheduleIdを作成できる', () => {
      const id = ShiftScheduleId.create()

      expect(id.value).toBeTruthy()
      expect(typeof id.value).toBe('string')
    })

    it('毎回異なるIDを生成する', () => {
      const id1 = ShiftScheduleId.create()
      const id2 = ShiftScheduleId.create()

      expect(id1.value).not.toBe(id2.value)
    })
  })

  describe('from', () => {
    it('有効なULID文字列からShiftScheduleIdを作成できる', () => {
      const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
      const id = ShiftScheduleId.from(validUlid)

      expect(id.value).toBe(validUlid)
    })

    it('無効な文字列の場合、エラーを投げる', () => {
      expect(() => {
        ShiftScheduleId.from('invalid-id')
      }).toThrow(InvalidShiftScheduleIdError)

      expect(() => {
        ShiftScheduleId.from('')
      }).toThrow(InvalidShiftScheduleIdError)

      expect(() => {
        ShiftScheduleId.from('123')
      }).toThrow(InvalidShiftScheduleIdError)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const id = ShiftScheduleId.create()

      expect(id.equals(id)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
      const id1 = ShiftScheduleId.from(validUlid)
      const id2 = ShiftScheduleId.from(validUlid)

      expect(id1.equals(id2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const id1 = ShiftScheduleId.create()
      const id2 = ShiftScheduleId.create()

      expect(id1.equals(id2)).toBe(false)
    })
  })
})
