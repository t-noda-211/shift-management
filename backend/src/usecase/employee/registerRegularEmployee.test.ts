import { Employee } from '@/domain/aggregates/employee'
import { EmployeeRepository } from '@/domain/repositories/employeeRepository'
import { EmployeeService } from '@/domain/service/employeeService'
import { describe, expect, it, jest } from '@jest/globals'

import { ValidationError } from '../errors'
import { EmployeeFullNameDuplicatedError } from './errors'
import { RegisterRegularEmployeeUsecase } from './registerRegularEmployee'

const MockEmployeeRepository = {
  save: jest.fn(),
} as Partial<jest.Mocked<EmployeeRepository>> as jest.Mocked<EmployeeRepository>

const MockEmployeeService = {
  isFullNameDuplicated: jest.fn(),
} as Partial<jest.Mocked<EmployeeService>> as jest.Mocked<EmployeeService>

describe('RegisterRegularEmployeeUsecase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })
  describe('execute', () => {
    it('正常な場合、従業員を作成できる', () => {
      MockEmployeeService.isFullNameDuplicated.mockReturnValue(false)
      const registerRegularEmployeeUsecase = new RegisterRegularEmployeeUsecase(
        MockEmployeeRepository,
        MockEmployeeService
      )

      const employee = registerRegularEmployeeUsecase.execute('山田太郎')

      expect(employee).toBeInstanceOf(Employee)
      expect(employee.fullName.value).toBe('山田太郎')
      expect(employee.type.code).toBe('REGULAR')
      expect(MockEmployeeRepository.save).toHaveBeenCalledWith(employee)
      expect(MockEmployeeService.isFullNameDuplicated).toHaveBeenCalledWith(
        employee
      )
    })

    it('氏名が無効な場合、エラーを投げる', () => {
      const registerRegularEmployeeUsecase = new RegisterRegularEmployeeUsecase(
        MockEmployeeRepository,
        MockEmployeeService
      )

      expect(() => {
        registerRegularEmployeeUsecase.execute('')
      }).toThrow(ValidationError)
      expect(MockEmployeeRepository.save).not.toHaveBeenCalled()
      expect(MockEmployeeService.isFullNameDuplicated).not.toHaveBeenCalled()
    })

    it('氏名が重複している場合、エラーを投げる', () => {
      MockEmployeeService.isFullNameDuplicated.mockReturnValue(true)
      const registerRegularEmployeeUsecase = new RegisterRegularEmployeeUsecase(
        MockEmployeeRepository,
        MockEmployeeService
      )

      expect(() => {
        registerRegularEmployeeUsecase.execute('山田太郎')
      }).toThrow(EmployeeFullNameDuplicatedError)
      expect(MockEmployeeRepository.save).not.toHaveBeenCalled()
      // expect(MockEmployeeService.isFullNameDuplicated).toHaveBeenCalledWith(employee)
    })
  })
})
