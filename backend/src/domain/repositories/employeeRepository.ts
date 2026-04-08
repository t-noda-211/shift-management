import { Employee } from '@/domain/aggregates/employee'
import { EmployeeFullName } from '@/domain/valueObjects'

export interface EmployeeRepository {
  save(employee: Employee): void
  findByFullName(fullName: EmployeeFullName): Employee | null
}
