import { EmployeeRepository } from '@/domain/repositories/employeeRepository'
import { EmployeeFullName } from '@/domain/valueObjects'

export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  isFullNameDuplicated(fullName: EmployeeFullName): boolean {
    const employees = this.employeeRepository.findByFullName(fullName)
    return employees !== null
  }
}
