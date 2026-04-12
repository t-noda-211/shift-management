import { TYPES } from '@/di/types'
import { Employee } from '@/domain/aggregates/employee'
import { DomainValidationError } from '@/domain/errors'
import type { IEmployeeRepository } from '@/domain/interfaces/iEmployeeRepository'
import { EmployeeService } from '@/domain/service/employeeService'
import { EmployeeType } from '@/domain/valueObjects'
import { inject, injectable } from 'inversify'
import { ValidationError } from '../errors'
import { EmployeeFullNameDuplicatedError } from './errors'

@injectable()
export class RegisterDispatchedEmployeeUsecase {
  constructor(
    @inject(TYPES.EmployeeRepository)
    private readonly employeeRepository: IEmployeeRepository,
    @inject(TYPES.EmployeeService)
    private readonly employeeService: EmployeeService
  ) {}

  execute(fullName: string): Employee {
    const type = EmployeeType.dispatched()

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
