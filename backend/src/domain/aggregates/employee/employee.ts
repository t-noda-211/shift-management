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
    private _fullName: EmployeeFullName,
    private _type: EmployeeType
  ) {}

  get fullName(): string {
    return this._fullName.value
  }

  get type(): EmployeeType {
    return this._type
  }

  static create(fullName: string, type: EmployeeType): Employee {
    const id = EmployeeId.create()
    return new Employee(id, new EmployeeFullName(fullName), type)
  }

  static from(
    id: EmployeeId,
    fullName: EmployeeFullName,
    type: EmployeeType
  ): Employee {
    return new Employee(id, fullName, type)
  }

  updateFullName(fullName: string): void {
    this._fullName = new EmployeeFullName(fullName)
  }

  updateType(type: EmployeeType): void {
    this._type = type
  }
}
