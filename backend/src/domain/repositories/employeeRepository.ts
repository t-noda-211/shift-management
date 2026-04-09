import { Employee } from '@/domain/aggregates/employee'
import { EmployeeFullName, EmployeeId } from '@/domain/valueObjects'

export interface EmployeeRepository {
  save(employee: Employee): void
  findById(id: EmployeeId): Employee | null
  findByFullName(fullName: EmployeeFullName): Employee | null
}
