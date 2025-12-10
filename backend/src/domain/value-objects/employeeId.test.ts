import { EmployeeId, InvalidEmployeeIdError } from './employeeId'

describe('EmployeeId', () => {
  describe('create', () => {
    it('新しいEmployeeIdを作成できる', () => {
      const employeeId = EmployeeId.create()

      expect(employeeId.value).toBeTruthy()
      expect(typeof employeeId.value).toBe('string')
    })

    it('毎回異なるIDを生成する', () => {
      const employeeId1 = EmployeeId.create()
      const employeeId2 = EmployeeId.create()

      expect(employeeId1.value).not.toBe(employeeId2.value)
    })
  })

  describe('from', () => {
    it('有効なULID文字列からEmployeeIdを作成できる', () => {
      const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
      const employeeId = EmployeeId.from(validUlid)

      expect(employeeId.value).toBe(validUlid)
    })

    it('無効な文字列の場合、エラーを投げる', () => {
      expect(() => {
        EmployeeId.from('invalid-id')
      }).toThrow(InvalidEmployeeIdError)

      expect(() => {
        EmployeeId.from('')
      }).toThrow(InvalidEmployeeIdError)

      expect(() => {
        EmployeeId.from('123')
      }).toThrow(InvalidEmployeeIdError)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const employeeId = EmployeeId.create()

      expect(employeeId.equals(employeeId)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
      const employeeId1 = EmployeeId.from(validUlid)
      const employeeId2 = EmployeeId.from(validUlid)

      expect(employeeId1.equals(employeeId2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const employeeId1 = EmployeeId.create()
      const employeeId2 = EmployeeId.create()

      expect(employeeId1.equals(employeeId2)).toBe(false)
    })
  })
})
