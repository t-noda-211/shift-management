import {
  EmployeeFullName,
  EmployeeId,
  EmployeeType,
} from '@/domain/valueObjects'

export class InvalidFullNameError extends AggregateError {
  constructor() {
    super('Invalid employee full name')
  }
}

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

  get fullName(): EmployeeFullName {
    return this._fullName
  }

  get type(): EmployeeType {
    return this._type
  }

  static create(fullName: string, type: EmployeeType): Employee {
    const id = EmployeeId.create()
    let fullNameObject: EmployeeFullName
    try {
      fullNameObject = new EmployeeFullName(fullName)
    } catch {
      throw new InvalidFullNameError()
    }
    return new Employee(id, fullNameObject, type)
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
