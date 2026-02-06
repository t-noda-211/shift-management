import {
  ShiftAssignmentId,
  InvalidShiftAssignmentIdError,
} from './shiftAssignmentId'

describe('ShiftAssignmentId', () => {
  describe('create', () => {
    it('新しいShiftAssignmentIdを作成できる', () => {
      const id = ShiftAssignmentId.create()

      expect(id.value).toBeTruthy()
      expect(typeof id.value).toBe('string')
    })

    it('毎回異なるIDを生成する', () => {
      const id1 = ShiftAssignmentId.create()
      const id2 = ShiftAssignmentId.create()

      expect(id1.value).not.toBe(id2.value)
    })
  })

  describe('from', () => {
    it('有効なULID文字列からShiftAssignmentIdを作成できる', () => {
      const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
      const id = ShiftAssignmentId.from(validUlid)

      expect(id.value).toBe(validUlid)
    })

    it('無効な文字列の場合、エラーを投げる', () => {
      expect(() => {
        ShiftAssignmentId.from('invalid-id')
      }).toThrow(InvalidShiftAssignmentIdError)

      expect(() => {
        ShiftAssignmentId.from('')
      }).toThrow(InvalidShiftAssignmentIdError)

      expect(() => {
        ShiftAssignmentId.from('123')
      }).toThrow(InvalidShiftAssignmentIdError)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const id = ShiftAssignmentId.create()

      expect(id.equals(id)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
      const id1 = ShiftAssignmentId.from(validUlid)
      const id2 = ShiftAssignmentId.from(validUlid)

      expect(id1.equals(id2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const id1 = ShiftAssignmentId.create()
      const id2 = ShiftAssignmentId.create()

      expect(id1.equals(id2)).toBe(false)
    })
  })
})
