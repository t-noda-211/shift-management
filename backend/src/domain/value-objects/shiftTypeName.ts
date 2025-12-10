import { ValueObjectError } from './valueObjectError'
import type { ValueObject } from './valueObject'

export class InvalidShiftTypeNameError extends ValueObjectError {
  constructor() {
    super(
      `Shift Type Name must be between 1 and ${ShiftTypeName.MAX_LENGTH} characters`
    )
  }
}

export class ShiftTypeName implements ValueObject {
  readonly value: string

  static readonly MAX_LENGTH = 10

  constructor(value: string) {
    if (value.length < 1 || value.length > ShiftTypeName.MAX_LENGTH) {
      throw new InvalidShiftTypeNameError()
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
