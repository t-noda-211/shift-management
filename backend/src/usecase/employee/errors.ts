import { UsecaseError } from '@/usecase/usecaseError'

export class InvalidEmployeeFullNameError extends UsecaseError {
  constructor() {
    super('氏名が無効な形式です')
  }
}

export class EmployeeFullNameDuplicatedError extends UsecaseError {
  constructor() {
    super('氏名が重複しています')
  }
}
