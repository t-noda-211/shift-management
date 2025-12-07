import { EmployeeId } from '@/domain/value-objects/employeeId'
import { EmployeeFullName } from '@/domain/value-objects/employeeFullName'
import { EmployeeType } from '@/domain/value-objects/employeeType'

/**
 * Employee エンティティ
 * 従業員情報を表す集約ルート
 */
export class Employee {
  private constructor(
    public readonly id: EmployeeId,
    public readonly fullName: EmployeeFullName,
    public readonly type: EmployeeType
  ) {}

  static create(fullName: EmployeeFullName, type: EmployeeType): Employee {
    const id = EmployeeId.create()
    return new Employee(id, fullName, type)
  }
}
