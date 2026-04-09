import { Employee } from '../aggregates/employee'
import { EmployeeRepository } from '../repositories/employeeRepository'
import { EmployeeFullName, EmployeeId, EmployeeType } from '../valueObjects'
import { EmployeeService } from './employeeService'

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
}

describe('EmployeeService', () => {
  describe('isFullNameDuplicated', () => {
    it('異なるユーザーで氏名が重複している場合、trueを返す', () => {
      const employeeRepository = new MockEmployeeRepository([
        Employee.create('山田太郎', EmployeeType.regular()),
      ])
      const employeeService = new EmployeeService(employeeRepository)

      const isDuplicated = employeeService.isFullNameDuplicated(
        Employee.create('山田太郎', EmployeeType.regular())
      )

      expect(isDuplicated).toBe(true)
    })

    it('異なるユーザーで氏名が重複していない場合、falseを返す', () => {
      const employeeRepository = new MockEmployeeRepository([
        Employee.create('佐藤花子', EmployeeType.regular()),
      ])
      const employeeService = new EmployeeService(employeeRepository)

      const isDuplicated = employeeService.isFullNameDuplicated(
        Employee.create('山田太郎', EmployeeType.regular())
      )

      expect(isDuplicated).toBe(false)
    })

    it('同じユーザーで氏名が重複している場合、falseを返す', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())
      const employeeRepository = new MockEmployeeRepository([employee])
      const employeeService = new EmployeeService(employeeRepository)

      const isDuplicated = employeeService.isFullNameDuplicated(employee)

      expect(isDuplicated).toBe(false)
    })
  })
})
