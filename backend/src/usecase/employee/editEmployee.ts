import { Employee } from '@/domain/aggregates/employee'
import { DomainValidationError } from '@/domain/errors'
import type { EmployeeRepository } from '@/domain/repositories/employeeRepository'
import { EmployeeService } from '@/domain/service/employeeService'
import {
  EmployeeId,
  EmployeeType,
  EmployeeTypeCode,
} from '@/domain/valueObjects'

import { TYPES } from '@/di/types'
import { inject, injectable } from 'inversify'
import { ValidationError } from '../errors'
import {
  EmployeeFullNameDuplicatedError,
  EmployeeNotFoundError,
} from './errors'

@injectable()
export class EditEmployeeUsecase {
  constructor(
    @inject(TYPES.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
    @inject(TYPES.EmployeeService)
    private readonly employeeService: EmployeeService
  ) {}

  execute({
    id,
    fullName,
    typeCode,
  }: {
    id: EmployeeId
    fullName?: string
    typeCode?: EmployeeTypeCode
  }): Employee {
    const employee = this.employeeRepository.findById(id)
    if (!employee) {
      throw new EmployeeNotFoundError()
    }

    if (fullName !== undefined) {
      try {
        employee.updateFullName(fullName)
      } catch (error) {
        if (error instanceof DomainValidationError) {
          throw new ValidationError()
        }
        throw error
      }
    }

    if (typeCode !== undefined && typeCode !== employee.type.code) {
      employee.updateType(EmployeeType.from(typeCode))
    }

    if (this.employeeService.isFullNameDuplicated(employee)) {
      throw new EmployeeFullNameDuplicatedError()
    }

    this.employeeRepository.save(employee)
    return employee
  }
}
