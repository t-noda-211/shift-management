import { Employee } from '@/domain/aggregates/employee'
import { EmployeeRepository } from '@/domain/repositories/employeeRepository'
import {
  EmployeeFullName,
  EmployeeId,
  EmployeeType,
} from '@/domain/valueObjects'

import { ValidationError } from '../errors'
import { EmployeeFullNameDuplicatedError } from './errors'
import { RegisterDispatchedEmployeeUsecase } from './registerDispatchedEmployee'

class MockEmployeeRepository implements EmployeeRepository {
  constructor(private readonly employees: Employee[] = []) {}

  save(employee: Employee): void {
    this.employees.push(employee)
  }

  findById(id: EmployeeId): Employee | null {
    return this.employees.find((employee) => employee.id.equals(id)) ?? null
  }

  findByFullName(fullName: EmployeeFullName): Employee | null {
    return (
      this.employees.find((employee) => employee.fullName.equals(fullName)) ??
      null
    )
  }

  getEmployeesCount(): number {
    return this.employees.length
  }
}

describe('RegisterDispatchedEmployeeUsecase', () => {
  describe('execute', () => {
    it('正常な場合、従業員を作成できる', () => {
      const employeeRepository = new MockEmployeeRepository()
      const registerDispatchedEmployeeUsecase =
        new RegisterDispatchedEmployeeUsecase(employeeRepository)

      const employee = registerDispatchedEmployeeUsecase.execute('山田太郎')

      expect(employee).toBeInstanceOf(Employee)
      expect(employee.fullName.value).toBe('山田太郎')
      expect(employee.type.code).toBe('DISPATCHED')
      expect(employeeRepository.getEmployeesCount()).toBe(1)
    })

    it('無効な場合、エラーを投げる', () => {
      const employeeRepository = new MockEmployeeRepository()
      const registerDispatchedEmployeeUsecase =
        new RegisterDispatchedEmployeeUsecase(employeeRepository)

      expect(() => {
        registerDispatchedEmployeeUsecase.execute('')
      }).toThrow(ValidationError)
      expect(employeeRepository.getEmployeesCount()).toBe(0)
    })

    it('氏名が重複している場合、エラーを投げる', () => {
      const employeeRepository = new MockEmployeeRepository([
        Employee.create('山田太郎', EmployeeType.regular()),
      ])
      const registerDispatchedEmployeeUsecase =
        new RegisterDispatchedEmployeeUsecase(employeeRepository)

      expect(() => {
        registerDispatchedEmployeeUsecase.execute('山田太郎')
      }).toThrow(EmployeeFullNameDuplicatedError)
      expect(employeeRepository.getEmployeesCount()).toBe(1)
    })
  })
})
