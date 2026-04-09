import { Employee, InvalidFullNameError } from '@/domain/aggregates/employee'
import { EmployeeRepository } from '@/domain/repositories/employeeRepository'
import { EmployeeService } from '@/domain/service/employeeService'
import {
  EmployeeId,
  EmployeeType,
  EmployeeTypeCode,
} from '@/domain/valueObjects'

import {
  InvalidEmployeeFullNameError,
  EmployeeFullNameDuplicatedError,
  EmployeeNotFoundError,
} from './errors'

export class EditEmployeeUsecase {
  private readonly employeeService: EmployeeService

  constructor(private readonly employeeRepository: EmployeeRepository) {
    this.employeeService = new EmployeeService(this.employeeRepository)
  }

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
        if (error instanceof InvalidFullNameError) {
          throw new InvalidEmployeeFullNameError()
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
