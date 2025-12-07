import { ValueObjectError } from './valueObjectError'

export class InvalidShiftTypeNameError extends ValueObjectError {
  constructor() {
    super(
      `Shift Type Name must be between 1 and ${ShiftTypeName.MAX_LENGTH} characters`
    )
  }
}

export class ShiftTypeName {
  readonly value: string

  static readonly MAX_LENGTH = 10

  constructor(value: string) {
    if (value.length < 1 || value.length > ShiftTypeName.MAX_LENGTH) {
      throw new InvalidShiftTypeNameError()
    }
    this.value = value
  }
}
