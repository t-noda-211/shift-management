import { Employee } from '@/domain/aggregates/employee'
import { IEmployeeRepository } from '@/domain/interfaces/iEmployeeRepository'
import { EmployeeService } from '@/domain/service/employeeService'
import { describe, expect, it, jest } from '@jest/globals'

import { ValidationError } from '../errors'
import { EmployeeFullNameDuplicatedError } from './errors'
import { RegisterDispatchedEmployeeUsecase } from './registerDispatchedEmployee'

const MockEmployeeRepository = {
  save: jest.fn(),
} as Partial<
  jest.Mocked<IEmployeeRepository>
> as jest.Mocked<IEmployeeRepository>

const MockEmployeeService = {
  isFullNameDuplicated: jest.fn(),
} as Partial<jest.Mocked<EmployeeService>> as jest.Mocked<EmployeeService>

describe('RegisterDispatchedEmployeeUsecase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })
  describe('execute', () => {
    it('正常な場合、従業員を作成できる', () => {
      MockEmployeeService.isFullNameDuplicated.mockReturnValue(false)
      const registerDispatchedEmployeeUsecase =
        new RegisterDispatchedEmployeeUsecase(
          MockEmployeeRepository,
          MockEmployeeService
        )

      const employee = registerDispatchedEmployeeUsecase.execute('山田太郎')

      expect(employee).toBeInstanceOf(Employee)
      expect(employee.fullName.value).toBe('山田太郎')
      expect(employee.type.code).toBe('DISPATCHED')
      expect(MockEmployeeRepository.save).toHaveBeenCalledWith(employee)
      expect(MockEmployeeService.isFullNameDuplicated).toHaveBeenCalledWith(
        employee
      )
    })

    it('無効な場合、エラーを投げる', () => {
      MockEmployeeService.isFullNameDuplicated.mockReturnValue(false)
      const registerDispatchedEmployeeUsecase =
        new RegisterDispatchedEmployeeUsecase(
          MockEmployeeRepository,
          MockEmployeeService
        )

      expect(() => {
        registerDispatchedEmployeeUsecase.execute('')
      }).toThrow(ValidationError)
      expect(MockEmployeeRepository.save).not.toHaveBeenCalled()
      expect(MockEmployeeService.isFullNameDuplicated).not.toHaveBeenCalled()
    })

    it('氏名が重複している場合、エラーを投げる', () => {
      MockEmployeeService.isFullNameDuplicated.mockReturnValue(true)
      const registerDispatchedEmployeeUsecase =
        new RegisterDispatchedEmployeeUsecase(
          MockEmployeeRepository,
          MockEmployeeService
        )

      expect(() => {
        registerDispatchedEmployeeUsecase.execute('山田太郎')
      }).toThrow(EmployeeFullNameDuplicatedError)
      expect(MockEmployeeRepository.save).not.toHaveBeenCalled()
      expect(MockEmployeeService.isFullNameDuplicated).toHaveBeenCalled()
    })
  })
})
