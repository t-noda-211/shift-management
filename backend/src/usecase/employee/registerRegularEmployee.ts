import { TYPES } from '@/di/types'
import { Employee } from '@/domain/aggregates/employee'
import { DomainValidationError } from '@/domain/errors'
import type { EmployeeRepository } from '@/domain/repositories/employeeRepository'
import { EmployeeService } from '@/domain/service/employeeService'
import { EmployeeType } from '@/domain/valueObjects'
import { inject, injectable } from 'inversify'

import { ValidationError } from '../errors'
import { EmployeeFullNameDuplicatedError } from './errors'

@injectable()
export class RegisterRegularEmployeeUsecase {
  constructor(
    @inject(TYPES.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
    @inject(TYPES.EmployeeService)
    private readonly employeeService: EmployeeService
  ) {}

  execute(fullName: string): Employee {
    const type = EmployeeType.regular()

    let employee: Employee
    try {
      employee = Employee.create(fullName, type)
    } catch (error) {
      if (error instanceof DomainValidationError) {
        throw new ValidationError()
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
