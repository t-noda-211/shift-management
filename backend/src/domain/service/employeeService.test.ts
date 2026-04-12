import { describe, expect, it, jest } from '@jest/globals'

import { Employee } from '../aggregates/employee'
import { EmployeeRepository } from '../repositories/employeeRepository'
import { EmployeeType } from '../valueObjects'
import { EmployeeService } from './employeeService'

const MockEmployeeRepository = {
  findByFullName: jest.fn(),
} as Partial<jest.Mocked<EmployeeRepository>> as jest.Mocked<EmployeeRepository>

describe('EmployeeService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })
  describe('isFullNameDuplicated', () => {
    it('異なるユーザーで氏名が重複している場合、trueを返す', () => {
      const existingEmployee = Employee.create(
        '山田太郎',
        EmployeeType.regular()
      )
      MockEmployeeRepository.findByFullName.mockReturnValue(existingEmployee)
      const employeeService = new EmployeeService(MockEmployeeRepository)

      const isDuplicated = employeeService.isFullNameDuplicated(
        Employee.create('山田太郎', EmployeeType.dispatched())
      )

      expect(isDuplicated).toBe(true)
    })

    it('氏名が重複している異なるユーザーが存在しない場合、falseを返す', () => {
      MockEmployeeRepository.findByFullName.mockReturnValue(null)
      const employeeService = new EmployeeService(MockEmployeeRepository)

      const isDuplicated = employeeService.isFullNameDuplicated(
        Employee.create('山田太郎', EmployeeType.regular())
      )

      expect(isDuplicated).toBe(false)
    })

    it('同じユーザーで氏名が重複している場合、falseを返す', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())
      MockEmployeeRepository.findByFullName.mockReturnValue(employee)
      const employeeService = new EmployeeService(MockEmployeeRepository)

      const isDuplicated = employeeService.isFullNameDuplicated(employee)

      expect(isDuplicated).toBe(false)
    })
  })
})
