import { ValueObjectError } from './valueObjectError'

export class InvalidEmployeeFullNameError extends ValueObjectError {
  constructor() {
    super(
      `Employee Full Name must be between 1 and ${EmployeeFullName.MAX_LENGTH} characters`
    )
  }
}

export class EmployeeFullName {
  readonly value: string

  static readonly MAX_LENGTH = 20

  constructor(value: string) {
    if (value.length < 1 || value.length > EmployeeFullName.MAX_LENGTH) {
      throw new InvalidEmployeeFullNameError()
    }
    this.value = value
  }
}
