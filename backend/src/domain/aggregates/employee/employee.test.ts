import {
  EmployeeFullName,
  EmployeeId,
  EmployeeType,
} from '@/domain/valueObjects'

import { Employee, InvalidFullNameError } from '.'

describe('Employee', () => {
  describe('create', () => {
    it('従業員を作成できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())

      expect(employee).toBeInstanceOf(Employee)
      expect(employee.fullName.value).toBe('山田太郎')
      expect(employee.type).toEqual(EmployeeType.regular())
      expect(employee.id).toBeInstanceOf(EmployeeId)
    })

    it('無効なフルネームの場合、エラーを投げる', () => {
      expect(() => {
        Employee.create('', EmployeeType.regular())
      }).toThrow(InvalidFullNameError)
    })
  })

  describe('from', () => {
    it('既存のIDと値オブジェクトから従業員を作成できる', () => {
      const id = EmployeeId.create()
      const fullName = new EmployeeFullName('佐藤花子')
      const type = EmployeeType.dispatched()

      const employee = Employee.from(id, fullName, type)

      expect(employee).toBeInstanceOf(Employee)
      expect(employee.id).toBe(id)
      expect(employee.fullName.value).toBe('佐藤花子')
      expect(employee.type).toEqual(type)
    })
  })

  describe('updateFullName', () => {
    it('フルネームを更新できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())

      employee.updateFullName('山田花子')

      expect(employee.fullName.value).toBe('山田花子')
    })

    it('複数回フルネームを更新できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())

      employee.updateFullName('山田花子')
      expect(employee.fullName.value).toBe('山田花子')

      employee.updateFullName('山田次郎')
      expect(employee.fullName.value).toBe('山田次郎')
    })

    it('無効なフルネームの場合、エラーを投げる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())
      expect(() => {
        employee.updateFullName('')
      }).toThrow(InvalidFullNameError)
    })
  })

  describe('updateType', () => {
    it('従業員種別を更新できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())

      employee.updateType(EmployeeType.dispatched())

      expect(employee.type).toEqual(EmployeeType.dispatched())
      expect(employee.type.isDispatched()).toBe(true)
      expect(employee.type.isRegular()).toBe(false)
    })

    it('社員から派遣に、派遣から社員に更新できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())

      employee.updateType(EmployeeType.dispatched())
      expect(employee.type.isDispatched()).toBe(true)

      employee.updateType(EmployeeType.regular())
      expect(employee.type.isRegular()).toBe(true)
    })

    it('複数回従業員種別を更新できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())

      employee.updateType(EmployeeType.dispatched())
      expect(employee.type.isDispatched()).toBe(true)

      employee.updateType(EmployeeType.regular())
      expect(employee.type.isRegular()).toBe(true)

      employee.updateType(EmployeeType.dispatched())
      expect(employee.type.isDispatched()).toBe(true)
    })
  })

  describe('updateFullName and updateType', () => {
    it('フルネームと従業員種別の両方を更新できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())

      employee.updateFullName('山田花子')
      employee.updateType(EmployeeType.dispatched())

      expect(employee.fullName.value).toBe('山田花子')
      expect(employee.type.isDispatched()).toBe(true)
    })
  })
})
