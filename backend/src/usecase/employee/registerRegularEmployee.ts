import { Employee, InvalidFullNameError } from '@/domain/aggregates/employee'
import { EmployeeRepository } from '@/domain/repositories/employeeRepository'
import { EmployeeService } from '@/domain/service/employeeService'
import { EmployeeType } from '@/domain/valueObjects'
import { UsecaseError } from '@/usecase/usecaseError'

export class InvalidEmployeeFullNameError extends UsecaseError {
  constructor() {
    super('氏名が無効な形式です')
  }
}

export class EmployeeFullNameDuplicatedError extends Error {
  constructor() {
    super('氏名が重複しています')
  }
}

export class RegisterRegularEmployeeUsecase {
  private readonly employeeService: EmployeeService

  constructor(private readonly employeeRepository: EmployeeRepository) {
    this.employeeService = new EmployeeService(this.employeeRepository)
  }

  execute(fullName: string): Employee {
    const type = EmployeeType.regular()

    let employee: Employee
    try {
      employee = Employee.create(fullName, type)
    } catch (error) {
      if (error instanceof InvalidFullNameError) {
        throw new InvalidEmployeeFullNameError()
      }
      throw error
    }

    if (this.employeeService.isFullNameDuplicated(employee.fullName)) {
      throw new EmployeeFullNameDuplicatedError()
    }

    this.employeeRepository.save(employee)
    return employee
  }
}
