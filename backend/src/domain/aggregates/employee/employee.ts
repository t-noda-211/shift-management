import { EmployeeId } from '@/domain/value-objects/employeeId'
import { EmployeeFullName } from '@/domain/value-objects/employeeFullName'
import { EmployeeType } from '@/domain/value-objects/employeeType'

/**
 * Employee エンティティ
 * 従業員情報を表す集約ルート
 */
export class Employee {
  constructor(
    public readonly id: EmployeeId,
    public readonly fullName: EmployeeFullName,
    public readonly type: EmployeeType
  ) {}
}
