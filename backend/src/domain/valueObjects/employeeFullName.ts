import type { ValueObject } from './valueObject'
import { DomainValidationError } from '../errors'

export class EmployeeFullName implements ValueObject {
  readonly value: string

  static readonly MAX_LENGTH = 20

  constructor(value: string) {
    if (value.length < 1 || value.length > EmployeeFullName.MAX_LENGTH) {
      throw new DomainValidationError(
        `Employee Full Name must be between 1 and ${EmployeeFullName.MAX_LENGTH} characters`
      )
    }
    this.value = value
  }

  equals(other: EmployeeFullName): boolean {
    if (this === other) {
      return true
    }

    return this.value === other.value
  }
}
