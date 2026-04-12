import { TYPES } from '@/di/types';
import { Employee } from '@/domain/aggregates/employee';
import type { EmployeeRepository } from '@/domain/repositories/employeeRepository';
import { inject, injectable } from 'inversify';

@injectable()
export class EmployeeService {
  constructor(@inject(TYPES.EmployeeRepository) private readonly employeeRepository: EmployeeRepository) {}

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
