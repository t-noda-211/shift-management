import { isValid as isValidUlid, ulid } from 'ulidx'

import type { ValueObject } from './valueObject'
import { DomainValidationError } from '../errors'

export class EmployeeId implements ValueObject {
  private constructor(readonly value: string) {}

  static create() {
    return new EmployeeId(ulid())
  }

  static from(value: string) {
    if (!isValidUlid(value)) {
      throw new DomainValidationError('Invalid Employee ID')
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
