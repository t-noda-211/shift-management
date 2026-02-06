import { EmployeeType, InvalidEmployeeTypeError } from './employeeType'

describe('EmployeeType', () => {
  describe('from', () => {
    it('有効なコード "REGULAR" からインスタンスを生成できる', () => {
      const employeeType = EmployeeType.from('REGULAR')

      expect(employeeType.code).toBe('REGULAR')
      expect(employeeType.name).toBe('社員')
    })

    it('有効なコード "DISPATCHED" からインスタンスを生成できる', () => {
      const employeeType = EmployeeType.from('DISPATCHED')

      expect(employeeType.code).toBe('DISPATCHED')
      expect(employeeType.name).toBe('派遣')
    })

    it('無効なコードの場合、エラーを投げる', () => {
      expect(() => {
        EmployeeType.from('INVALID')
      }).toThrow(InvalidEmployeeTypeError)

      expect(() => {
        EmployeeType.from('regular')
      }).toThrow(InvalidEmployeeTypeError)

      expect(() => {
        EmployeeType.from('')
      }).toThrow(InvalidEmployeeTypeError)
    })
  })

  describe('regular', () => {
    it('社員のインスタンスを作成できる', () => {
      const employeeType = EmployeeType.regular()

      expect(employeeType.code).toBe('REGULAR')
      expect(employeeType.name).toBe('社員')
    })
  })

  describe('dispatched', () => {
    it('派遣のインスタンスを作成できる', () => {
      const employeeType = EmployeeType.dispatched()

      expect(employeeType.code).toBe('DISPATCHED')
      expect(employeeType.name).toBe('派遣')
    })
  })

  describe('isRegular', () => {
    it('社員の場合、trueを返す', () => {
      const employeeType = EmployeeType.regular()

      expect(employeeType.isRegular()).toBe(true)
    })

    it('派遣の場合、falseを返す', () => {
      const employeeType = EmployeeType.dispatched()

      expect(employeeType.isRegular()).toBe(false)
    })
  })

  describe('isDispatched', () => {
    it('派遣の場合、trueを返す', () => {
      const employeeType = EmployeeType.dispatched()

      expect(employeeType.isDispatched()).toBe(true)
    })

    it('社員の場合、falseを返す', () => {
      const employeeType = EmployeeType.regular()

      expect(employeeType.isDispatched()).toBe(false)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const employeeType = EmployeeType.regular()

      expect(employeeType.equals(employeeType)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const employeeType1 = EmployeeType.regular()
      const employeeType2 = EmployeeType.regular()

      expect(employeeType1.equals(employeeType2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const employeeType1 = EmployeeType.regular()
      const employeeType2 = EmployeeType.dispatched()

      expect(employeeType1.equals(employeeType2)).toBe(false)
    })
  })
})
