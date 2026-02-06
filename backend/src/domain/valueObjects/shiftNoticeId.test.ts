import { ShiftNoticeId, InvalidShiftNoticeIdError } from './shiftNoticeId'

describe('ShiftNoticeId', () => {
  describe('create', () => {
    it('新しいShiftNoticeIdを作成できる', () => {
      const id = ShiftNoticeId.create()

      expect(id.value).toBeTruthy()
      expect(typeof id.value).toBe('string')
    })

    it('毎回異なるIDを生成する', () => {
      const id1 = ShiftNoticeId.create()
      const id2 = ShiftNoticeId.create()

      expect(id1.value).not.toBe(id2.value)
    })
  })

  describe('from', () => {
    it('有効なULID文字列からShiftNoticeIdを作成できる', () => {
      const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
      const id = ShiftNoticeId.from(validUlid)

      expect(id.value).toBe(validUlid)
    })

    it('無効な文字列の場合、エラーを投げる', () => {
      expect(() => {
        ShiftNoticeId.from('invalid-id')
      }).toThrow(InvalidShiftNoticeIdError)

      expect(() => {
        ShiftNoticeId.from('')
      }).toThrow(InvalidShiftNoticeIdError)

      expect(() => {
        ShiftNoticeId.from('123')
      }).toThrow(InvalidShiftNoticeIdError)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const id = ShiftNoticeId.create()

      expect(id.equals(id)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
      const id1 = ShiftNoticeId.from(validUlid)
      const id2 = ShiftNoticeId.from(validUlid)

      expect(id1.equals(id2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const id1 = ShiftNoticeId.create()
      const id2 = ShiftNoticeId.create()

      expect(id1.equals(id2)).toBe(false)
    })
  })
})
