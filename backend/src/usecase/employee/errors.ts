import { UsecaseError } from '@/usecase/errors'

export class EmployeeFullNameDuplicatedError extends UsecaseError {
  constructor() {
    super('氏名が重複しています')
  }
}

export class EmployeeNotFoundError extends UsecaseError {
  constructor() {
    super('従業員が見つかりません')
  }
}
