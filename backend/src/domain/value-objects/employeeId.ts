import { ulid, isValid as isValidUlid } from 'ulidx'

export class InvalidEmployeeIdError extends Error {
  constructor() {
    super('Invalid Employee ID')
    this.name = 'InvalidEmployeeIdError'
  }
}

export class EmployeeId {
  private constructor(readonly value: string) {}

  static create() {
    return new EmployeeId(ulid())
  }

  static from(value: string) {
    if (!isValidUlid(value)) {
      throw new InvalidEmployeeIdError()
    }
    return new EmployeeId(value)
  }
}
