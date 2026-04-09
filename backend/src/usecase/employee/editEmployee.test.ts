import { Employee } from '@/domain/aggregates/employee'
import { EmployeeRepository } from '@/domain/repositories/employeeRepository'
import {
  EmployeeFullName,
  EmployeeId,
  EmployeeType,
} from '@/domain/valueObjects'

import { EditEmployeeUsecase } from './editEmployee'
import {
  EmployeeFullNameDuplicatedError,
  EmployeeNotFoundError,
  InvalidEmployeeFullNameError,
} from './errors'

class MockEmployeeRepository implements EmployeeRepository {
  save = jest.fn()
  findById = jest.fn()
  findByFullName = jest.fn()
}

describe('EditEmployeeUsecase', () => {
  describe('execute', () => {
    it('氏名と従業員種別を編集できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())
      const employeeRepository = new MockEmployeeRepository()
      employeeRepository.findById.mockReturnValue(employee)
      employeeRepository.findByFullName.mockReturnValue(null)
      const editEmployeeUsecase = new EditEmployeeUsecase(employeeRepository)
      const updatedEmployee = editEmployeeUsecase.execute({
        id: employee.id,
        fullName: '山田花子',
        typeCode: 'DISPATCHED',
      })
      expect(updatedEmployee.fullName.value).toBe('山田花子')
      expect(updatedEmployee.type.code).toBe('DISPATCHED')
      expect(employeeRepository.findById).toHaveBeenCalledWith(employee.id)
      expect(employeeRepository.findByFullName).toHaveBeenCalledWith(
        new EmployeeFullName('山田花子')
      )
      expect(employeeRepository.save).toHaveBeenCalledWith(updatedEmployee)
    })

    it('氏名のみを編集できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())
      const employeeRepository = new MockEmployeeRepository()
      employeeRepository.findById.mockReturnValue(employee)
      employeeRepository.findByFullName.mockReturnValue(null)
      const editEmployeeUsecase = new EditEmployeeUsecase(employeeRepository)
      const updatedEmployee = editEmployeeUsecase.execute({
        id: employee.id,
        fullName: '山田花子',
      })
      expect(updatedEmployee.fullName.value).toBe('山田花子')
      expect(updatedEmployee.type.code).toBe('REGULAR')
      expect(employeeRepository.findById).toHaveBeenCalledWith(employee.id)
      expect(employeeRepository.findByFullName).toHaveBeenCalledWith(
        new EmployeeFullName('山田花子')
      )
      expect(employeeRepository.save).toHaveBeenCalledWith(updatedEmployee)
    })

    it('従業員種別のみを編集できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())
      const employeeRepository = new MockEmployeeRepository()
      employeeRepository.findById.mockReturnValue(employee)
      employeeRepository.findByFullName.mockReturnValue(null)
      const editEmployeeUsecase = new EditEmployeeUsecase(employeeRepository)
      const updatedEmployee = editEmployeeUsecase.execute({
        id: employee.id,
        typeCode: 'DISPATCHED',
      })
      expect(updatedEmployee.fullName.value).toBe('山田太郎')
      expect(updatedEmployee.type.code).toBe('DISPATCHED')
      expect(employeeRepository.findById).toHaveBeenCalledWith(employee.id)
      expect(employeeRepository.findByFullName).toHaveBeenCalledWith(
        new EmployeeFullName('山田太郎')
      )
      expect(employeeRepository.save).toHaveBeenCalledWith(updatedEmployee)
    })

    it('従業員種別が同じ場合、編集できる', () => {
      const employee = Employee.create('山田太郎', EmployeeType.regular())
      const employeeRepository = new MockEmployeeRepository()
      employeeRepository.findById.mockReturnValue(employee)
      employeeRepository.findByFullName.mockReturnValue(null)
      const editEmployeeUsecase = new EditEmployeeUsecase(employeeRepository)
      const updatedEmployee = editEmployeeUsecase.execute({
        id: employee.id,
        typeCode: 'REGULAR',
      })
      expect(updatedEmployee.fullName.value).toBe('山田太郎')
      expect(updatedEmployee.type.code).toBe('REGULAR')
      expect(employeeRepository.findById).toHaveBeenCalledWith(employee.id)
      expect(employeeRepository.findByFullName).toHaveBeenCalledWith(
        new EmployeeFullName('山田太郎')
      )
      expect(employeeRepository.save).toHaveBeenCalledWith(updatedEmployee)
    })

    describe('異常系', () => {
      it('従業員が存在しない場合、エラーを投げる', () => {
        const employeeRepository = new MockEmployeeRepository()
        employeeRepository.findById.mockReturnValue(null)
        const editEmployeeUsecase = new EditEmployeeUsecase(employeeRepository)
        const id = EmployeeId.create()
        expect(() => {
          editEmployeeUsecase.execute({
            id,
            fullName: '山田花子',
          })
        }).toThrow(EmployeeNotFoundError)
        expect(employeeRepository.findById).toHaveBeenCalledWith(id)
        expect(employeeRepository.findByFullName).not.toHaveBeenCalled()
        expect(employeeRepository.save).not.toHaveBeenCalled()
      })

      it('氏名が無効な場合、エラーを投げる', () => {
        const employee = Employee.create('山田太郎', EmployeeType.regular())
        const employeeRepository = new MockEmployeeRepository()
        employeeRepository.findById.mockReturnValue(employee)
        employeeRepository.findByFullName.mockReturnValue(null)
        const editEmployeeUsecase = new EditEmployeeUsecase(employeeRepository)
        expect(() => {
          editEmployeeUsecase.execute({ id: employee.id, fullName: '' })
        }).toThrow(InvalidEmployeeFullNameError)
        expect(employeeRepository.findById).toHaveBeenCalledWith(employee.id)
        expect(employeeRepository.findByFullName).not.toHaveBeenCalled()
        expect(employeeRepository.save).not.toHaveBeenCalled()
      })

      it('氏名が重複している場合、エラーを投げる', () => {
        const employee = Employee.create('山田太郎', EmployeeType.regular())
        const employee2 = Employee.create('山田花子', EmployeeType.regular())
        const employeeRepository = new MockEmployeeRepository()
        employeeRepository.findById.mockReturnValue(employee)
        employeeRepository.findByFullName.mockReturnValue(employee2)
        const editEmployeeUsecase = new EditEmployeeUsecase(employeeRepository)
        expect(() => {
          editEmployeeUsecase.execute({ id: employee.id, fullName: '山田花子' })
        }).toThrow(EmployeeFullNameDuplicatedError)
        expect(employeeRepository.findById).toHaveBeenCalledWith(employee.id)
        expect(employeeRepository.findByFullName).toHaveBeenCalledWith(
          new EmployeeFullName('山田花子')
        )
        expect(employeeRepository.save).not.toHaveBeenCalled()
      })
    })
  })
})
