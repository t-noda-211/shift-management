import { ulid, isValid as isValidUlid } from 'ulidx'
import { ValueObjectError } from './valueObjectError'

export class InvalidTimeOffIdError extends ValueObjectError {
  constructor() {
    super('Invalid TimeOff ID')
  }
}

export class TimeOffId {
  private constructor(readonly value: string) {}

  static create() {
    return new TimeOffId(ulid())
  }

  static from(value: string) {
    if (!isValidUlid(value)) {
      throw new InvalidTimeOffIdError()
    }
    return new TimeOffId(value)
  }
}
