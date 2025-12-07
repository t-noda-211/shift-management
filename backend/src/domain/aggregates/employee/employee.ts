import { EmployeeId } from '@/domain/value-objects/employeeId'

/**
 * Employee エンティティ
 * 従業員情報を表す集約ルート
 */
export class Employee {
  constructor(
    public readonly id: EmployeeId
    // その他のプロパティは後で追加
  ) {}
}
