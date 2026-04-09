import { Employee } from '@/domain/aggregates/employee'
import { EmployeeRepository } from '@/domain/repositories/employeeRepository'
import {
  EmployeeFullName,
  EmployeeId,
  EmployeeType,
} from '@/domain/valueObjects'

import {
  EmployeeFullNameDuplicatedError,
  InvalidEmployeeFullNameError,
} from './errors'
import { RegisterRegularEmployeeUsecase } from './registerRegularEmployee'

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

describe('RegisterRegularEmployeeUsecase', () => {
  describe('execute', () => {
    it('正常な場合、従業員を作成できる', () => {
      const employeeRepository = new MockEmployeeRepository()
      const registerRegularEmployeeUsecase = new RegisterRegularEmployeeUsecase(
        employeeRepository
      )

      const employee = registerRegularEmployeeUsecase.execute('山田太郎')

      expect(employee).toBeInstanceOf(Employee)
      expect(employee.fullName.value).toBe('山田太郎')
      expect(employee.type.code).toBe('REGULAR')
      expect(employeeRepository.getEmployeesCount()).toBe(1)
    })

    it('無効な場合、エラーを投げる', () => {
      const employeeRepository = new MockEmployeeRepository()
      const registerRegularEmployeeUsecase = new RegisterRegularEmployeeUsecase(
        employeeRepository
      )

      expect(() => {
        registerRegularEmployeeUsecase.execute('')
      }).toThrow(InvalidEmployeeFullNameError)
      expect(employeeRepository.getEmployeesCount()).toBe(0)
    })

    it('氏名が重複している場合、エラーを投げる', () => {
      const employeeRepository = new MockEmployeeRepository([
        Employee.create('山田太郎', EmployeeType.regular()),
      ])
      const registerRegularEmployeeUsecase = new RegisterRegularEmployeeUsecase(
        employeeRepository
      )

      expect(() => {
        registerRegularEmployeeUsecase.execute('山田太郎')
      }).toThrow(EmployeeFullNameDuplicatedError)
      expect(employeeRepository.getEmployeesCount()).toBe(1)
    })
  })
})
