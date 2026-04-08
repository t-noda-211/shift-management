import { Employee } from '../aggregates/employee'
import { EmployeeRepository } from '../repositories/employeeRepository'
import { EmployeeFullName, EmployeeType } from '../valueObjects'
import { EmployeeService } from './employeeService'

class MockEmployeeRepository implements EmployeeRepository {
  constructor(private readonly employees: Employee[] = []) {}

  save(employee: Employee): void {
    this.employees.push(employee)
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
    it('氏名が重複している場合、trueを返す', () => {
      const employeeRepository = new MockEmployeeRepository([
        Employee.create('山田太郎', EmployeeType.regular()),
      ])
      const employeeService = new EmployeeService(employeeRepository)

      const isDuplicated = employeeService.isFullNameDuplicated(
        new EmployeeFullName('山田太郎')
      )

      expect(isDuplicated).toBe(true)
    })

    it('氏名が重複していない場合、falseを返す', () => {
      const employeeRepository = new MockEmployeeRepository([
        Employee.create('佐藤花子', EmployeeType.regular()),
      ])
      const employeeService = new EmployeeService(employeeRepository)

      const isDuplicated = employeeService.isFullNameDuplicated(
        new EmployeeFullName('山田太郎')
      )

      expect(isDuplicated).toBe(false)
    })
  })
})
