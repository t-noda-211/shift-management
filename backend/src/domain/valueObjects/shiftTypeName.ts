import type { ValueObject } from './valueObject'
import { DomainValidationError } from '../errors'

export class ShiftTypeName implements ValueObject {
  readonly value: string

  static readonly MAX_LENGTH = 10

  constructor(value: string) {
    if (value.length < 1 || value.length > ShiftTypeName.MAX_LENGTH) {
      throw new DomainValidationError(
        `Shift Type Name must be between 1 and ${ShiftTypeName.MAX_LENGTH} characters`
      )
    }
    this.value = value
  }

  equals(other: ShiftTypeName): boolean {
    if (this === other) {
      return true
    }

    return this.value === other.value
  }
}
