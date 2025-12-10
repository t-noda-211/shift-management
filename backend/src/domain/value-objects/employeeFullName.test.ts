import {
  EmployeeFullName,
  InvalidEmployeeFullNameError,
} from './employeeFullName'

describe('EmployeeFullName', () => {
  describe('constructor', () => {
    it('正常な名前を作成できる', () => {
      const name = new EmployeeFullName('山田太郎')

      expect(name.value).toBe('山田太郎')
    })

    it('最小長（1文字）の名前を作成できる', () => {
      const name = new EmployeeFullName('山')

      expect(name.value).toBe('山')
    })

    it('最大長（20文字）の名前を作成できる', () => {
      const longName = 'あ'.repeat(20)
      const name = new EmployeeFullName(longName)

      expect(name.value).toBe(longName)
    })

    it('空文字列の場合、エラーを投げる', () => {
      expect(() => {
        new EmployeeFullName('')
      }).toThrow(InvalidEmployeeFullNameError)
    })

    it('最大長を超える場合、エラーを投げる', () => {
      const tooLongName = 'あ'.repeat(21)

      expect(() => {
        new EmployeeFullName(tooLongName)
      }).toThrow(InvalidEmployeeFullNameError)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const name = new EmployeeFullName('山田太郎')

      expect(name.equals(name)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const name1 = new EmployeeFullName('山田太郎')
      const name2 = new EmployeeFullName('山田太郎')

      expect(name1.equals(name2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const name1 = new EmployeeFullName('山田太郎')
      const name2 = new EmployeeFullName('佐藤花子')

      expect(name1.equals(name2)).toBe(false)
    })
  })
})
