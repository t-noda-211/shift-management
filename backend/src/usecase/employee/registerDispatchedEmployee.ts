import { Employee, InvalidFullNameError } from '@/domain/aggregates/employee'
import { EmployeeRepository } from '@/domain/repositories/employeeRepository'
import { EmployeeService } from '@/domain/service/employeeService'
import { EmployeeType } from '@/domain/valueObjects'

import {
  InvalidEmployeeFullNameError,
  EmployeeFullNameDuplicatedError,
} from './errors'

export class RegisterDispatchedEmployeeUsecase {
  private readonly employeeService: EmployeeService

  constructor(private readonly employeeRepository: EmployeeRepository) {
    this.employeeService = new EmployeeService(this.employeeRepository)
  }

  execute(fullName: string): Employee {
    const type = EmployeeType.dispatched()

    let employee: Employee
    try {
      employee = Employee.create(fullName, type)
    } catch (error) {
      if (error instanceof InvalidFullNameError) {
        throw new InvalidEmployeeFullNameError()
      }
      throw error
    }

    if (this.employeeService.isFullNameDuplicated(employee)) {
      throw new EmployeeFullNameDuplicatedError()
    }

    this.employeeRepository.save(employee)
    return employee
  }
}
