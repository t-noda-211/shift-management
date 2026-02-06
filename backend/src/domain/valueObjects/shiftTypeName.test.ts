import { ShiftTypeName, InvalidShiftTypeNameError } from './shiftTypeName'

describe('ShiftTypeName', () => {
  describe('constructor', () => {
    it('正常な名前を作成できる', () => {
      const name = new ShiftTypeName('早番')

      expect(name.value).toBe('早番')
    })

    it('最小長（1文字）の名前を作成できる', () => {
      const name = new ShiftTypeName('早')

      expect(name.value).toBe('早')
    })

    it('最大長（10文字）の名前を作成できる', () => {
      const longName = 'あ'.repeat(10)
      const name = new ShiftTypeName(longName)

      expect(name.value).toBe(longName)
    })

    it('空文字列の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftTypeName('')
      }).toThrow(InvalidShiftTypeNameError)
    })

    it('最大長を超える場合、エラーを投げる', () => {
      const tooLongName = 'あ'.repeat(11)

      expect(() => {
        new ShiftTypeName(tooLongName)
      }).toThrow(InvalidShiftTypeNameError)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const name = new ShiftTypeName('早番')

      expect(name.equals(name)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const name1 = new ShiftTypeName('早番')
      const name2 = new ShiftTypeName('早番')

      expect(name1.equals(name2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const name1 = new ShiftTypeName('早番')
      const name2 = new ShiftTypeName('遅番')

      expect(name1.equals(name2)).toBe(false)
    })
  })
})
