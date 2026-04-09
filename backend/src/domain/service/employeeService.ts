import { Employee } from '@/domain/aggregates/employee'
import { EmployeeRepository } from '@/domain/repositories/employeeRepository'

export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  isFullNameDuplicated(employee: Employee): boolean {
    const resultEmployee = this.employeeRepository.findByFullName(
      employee.fullName
    )
    if (resultEmployee === null) {
      return false
    }
    return !resultEmployee.id.equals(employee.id)
  }
}
