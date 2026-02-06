import { ulid, isValid as isValidUlid } from 'ulidx'

import type { ValueObject } from './valueObject'
import { ValueObjectError } from './valueObjectError'

export class InvalidEmployeeIdError extends ValueObjectError {
  constructor() {
    super('Invalid Employee ID')
  }
}

export class EmployeeId implements ValueObject {
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

  equals(other: EmployeeId): boolean {
    if (this === other) {
      return true
    }

    return this.value === other.value
  }
}
