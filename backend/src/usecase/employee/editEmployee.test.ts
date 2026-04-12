import { Employee } from '@/domain/aggregates/employee'
import { EmployeeRepository } from '@/domain/repositories/employeeRepository'
import { EmployeeService } from '@/domain/service/employeeService'
import { EmployeeId, EmployeeType } from '@/domain/valueObjects'
import { describe, expect, it, jest } from '@jest/globals'

import { ValidationError } from '../errors'
import { EditEmployeeUsecase } from './editEmployee'
import {
  EmployeeFullNameDuplicatedError,
  EmployeeNotFoundError,
} from './errors'

const MockEmployeeRepository = {
  save: jest.fn(),
  findById: jest.fn(),
} as Partial<jest.Mocked<EmployeeRepository>> as jest.Mocked<EmployeeRepository>

const MockEmployeeService = {
  isFullNameDuplicated: jest.fn(),
} as Partial<jest.Mocked<EmployeeService>> as jest.Mocked<EmployeeService>

describe('EditEmployeeUsecase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })
  describe('execute', () => {
    it('氏名と従業員種別を編集できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())
      MockEmployeeRepository.findById.mockReturnValue(employee)
      MockEmployeeService.isFullNameDuplicated.mockReturnValue(false)
      const editEmployeeUsecase = new EditEmployeeUsecase(
        MockEmployeeRepository,
        MockEmployeeService
      )
      const updatedEmployee = editEmployeeUsecase.execute({
        id: employee.id,
        fullName: '山田花子',
        typeCode: 'DISPATCHED',
      })
      expect(updatedEmployee.fullName.value).toBe('山田花子')
      expect(updatedEmployee.type.code).toBe('DISPATCHED')
      expect(MockEmployeeRepository.findById).toHaveBeenCalledWith(employee.id)
      expect(MockEmployeeService.isFullNameDuplicated).toHaveBeenCalledWith(
        updatedEmployee
      )
      expect(MockEmployeeRepository.save).toHaveBeenCalledWith(updatedEmployee)
    })

    it('氏名のみを編集できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())
      MockEmployeeRepository.findById.mockReturnValue(employee)
      MockEmployeeService.isFullNameDuplicated.mockReturnValue(false)
      const editEmployeeUsecase = new EditEmployeeUsecase(
        MockEmployeeRepository,
        MockEmployeeService
      )
      const updatedEmployee = editEmployeeUsecase.execute({
        id: employee.id,
        fullName: '山田花子',
      })
      expect(updatedEmployee.fullName.value).toBe('山田花子')
      expect(updatedEmployee.type.code).toBe('REGULAR')
      expect(MockEmployeeRepository.findById).toHaveBeenCalledWith(employee.id)
      expect(MockEmployeeService.isFullNameDuplicated).toHaveBeenCalledWith(
        updatedEmployee
      )
      expect(MockEmployeeRepository.save).toHaveBeenCalledWith(updatedEmployee)
    })

    it('従業員種別のみを編集できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())
      MockEmployeeRepository.findById.mockReturnValue(employee)
      MockEmployeeService.isFullNameDuplicated.mockReturnValue(false)
      const editEmployeeUsecase = new EditEmployeeUsecase(
        MockEmployeeRepository,
        MockEmployeeService
      )
      const updatedEmployee = editEmployeeUsecase.execute({
        id: employee.id,
        typeCode: 'DISPATCHED',
      })
      expect(updatedEmployee.fullName.value).toBe('山田太郎')
      expect(updatedEmployee.type.code).toBe('DISPATCHED')
      expect(MockEmployeeRepository.findById).toHaveBeenCalledWith(employee.id)
      expect(MockEmployeeService.isFullNameDuplicated).toHaveBeenCalledWith(
        updatedEmployee
      )
      expect(MockEmployeeRepository.save).toHaveBeenCalledWith(updatedEmployee)
    })

    it('従業員種別が同じ場合、編集できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())
      MockEmployeeRepository.findById.mockReturnValue(employee)
      MockEmployeeService.isFullNameDuplicated.mockReturnValue(false)
      const editEmployeeUsecase = new EditEmployeeUsecase(
        MockEmployeeRepository,
        MockEmployeeService
      )
      const updatedEmployee = editEmployeeUsecase.execute({
        id: employee.id,
        typeCode: 'REGULAR',
      })
      expect(updatedEmployee.fullName.value).toBe('山田太郎')
      expect(updatedEmployee.type.code).toBe('REGULAR')
      expect(MockEmployeeRepository.findById).toHaveBeenCalledWith(employee.id)
      expect(MockEmployeeService.isFullNameDuplicated).toHaveBeenCalledWith(
        updatedEmployee
      )
      expect(MockEmployeeRepository.save).toHaveBeenCalledWith(updatedEmployee)
    })

    describe('異常系', () => {
      it('従業員が存在しない場合、エラーを投げる', () => {
        MockEmployeeRepository.findById.mockReturnValue(null)
        const editEmployeeUsecase = new EditEmployeeUsecase(
          MockEmployeeRepository,
          MockEmployeeService
        )
        const id = EmployeeId.create()
        expect(() => {
          editEmployeeUsecase.execute({
            id,
            fullName: '山田花子',
          })
        }).toThrow(EmployeeNotFoundError)
        expect(MockEmployeeRepository.findById).toHaveBeenCalledWith(id)
        expect(MockEmployeeService.isFullNameDuplicated).not.toHaveBeenCalled()
        expect(MockEmployeeRepository.save).not.toHaveBeenCalled()
      })

      it('氏名が無効な場合、エラーを投げる', () => {
        const employee = Employee.create('山田太郎', EmployeeType.regular())
        MockEmployeeRepository.findById.mockReturnValue(employee)
        MockEmployeeService.isFullNameDuplicated.mockReturnValue(false)
        const editEmployeeUsecase = new EditEmployeeUsecase(
          MockEmployeeRepository,
          MockEmployeeService
        )
        expect(() => {
          editEmployeeUsecase.execute({ id: employee.id, fullName: '' })
        }).toThrow(ValidationError)
        expect(MockEmployeeRepository.findById).toHaveBeenCalledWith(
          employee.id
        )
        expect(MockEmployeeService.isFullNameDuplicated).not.toHaveBeenCalled()
        expect(MockEmployeeRepository.save).not.toHaveBeenCalled()
      })

      it('氏名が重複している場合、エラーを投げる', () => {
        const employee = Employee.create('山田太郎', EmployeeType.regular())
        MockEmployeeRepository.findById.mockReturnValue(employee)
        MockEmployeeService.isFullNameDuplicated.mockReturnValue(true)
        const editEmployeeUsecase = new EditEmployeeUsecase(
          MockEmployeeRepository,
          MockEmployeeService
        )
        expect(() => {
          editEmployeeUsecase.execute({ id: employee.id, fullName: '山田花子' })
        }).toThrow(EmployeeFullNameDuplicatedError)
        expect(MockEmployeeRepository.findById).toHaveBeenCalledWith(
          employee.id
        )
        expect(MockEmployeeService.isFullNameDuplicated).toHaveBeenCalledWith(
          employee
        )
        expect(MockEmployeeRepository.save).not.toHaveBeenCalled()
      })
    })
  })
})
