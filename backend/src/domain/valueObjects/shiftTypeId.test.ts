import { ShiftTypeId, InvalidShiftTypeIdError } from './shiftTypeId'

describe('ShiftTypeId', () => {
  describe('create', () => {
    it('新しいShiftTypeIdを作成できる', () => {
      const id = ShiftTypeId.create()

      expect(id.value).toBeTruthy()
      expect(typeof id.value).toBe('string')
    })

    it('毎回異なるIDを生成する', () => {
      const id1 = ShiftTypeId.create()
      const id2 = ShiftTypeId.create()

      expect(id1.value).not.toBe(id2.value)
    })
  })

  describe('from', () => {
    it('有効なULID文字列からShiftTypeIdを作成できる', () => {
      const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
      const id = ShiftTypeId.from(validUlid)

      expect(id.value).toBe(validUlid)
    })

    it('無効な文字列の場合、エラーを投げる', () => {
      expect(() => {
        ShiftTypeId.from('invalid-id')
      }).toThrow(InvalidShiftTypeIdError)

      expect(() => {
        ShiftTypeId.from('')
      }).toThrow(InvalidShiftTypeIdError)

      expect(() => {
        ShiftTypeId.from('123')
      }).toThrow(InvalidShiftTypeIdError)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const id = ShiftTypeId.create()

      expect(id.equals(id)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
      const id1 = ShiftTypeId.from(validUlid)
      const id2 = ShiftTypeId.from(validUlid)

      expect(id1.equals(id2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const id1 = ShiftTypeId.create()
      const id2 = ShiftTypeId.create()

      expect(id1.equals(id2)).toBe(false)
    })
  })
})
