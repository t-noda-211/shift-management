import { ulid, isValid as isValidUlid } from 'ulidx'

export class InvalidTimeOffIdError extends Error {
  constructor() {
    super('Invalid TimeOff ID')
    this.name = 'InvalidTimeOffIdError'
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
