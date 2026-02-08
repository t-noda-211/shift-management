import {
  EmployeeId,
  ShiftAssignmentDate,
  ShiftAssignmentId,
  ShiftScheduleId,
  ShiftTypeId,
} from '@/domain/valueObjects'

import { StandardShiftAssignment } from './standardShiftAssignment'

describe('StandardShiftAssignment', () => {
  const shiftScheduleId = ShiftScheduleId.create()
  const employeeId = EmployeeId.create()
  const date = new ShiftAssignmentDate('2024-01-15')
  const shiftTypeId = ShiftTypeId.create()

  describe('create', () => {
    it('標準シフトアサインを作成できる', () => {
      const assignment = StandardShiftAssignment.create(
        shiftScheduleId,
        date,
        employeeId,
        shiftTypeId
      )

      expect(assignment.id).toBeInstanceOf(ShiftAssignmentId)
      expect(assignment.shiftScheduleId).toBe(shiftScheduleId)
      expect(assignment.employeeId).toBe(employeeId)
      expect(assignment.date).toBe(date)
      expect(assignment.shiftTypeId).toBe(shiftTypeId)
    })

    it('毎回新しいIDが生成される', () => {
      const assignment1 = StandardShiftAssignment.create(
        shiftScheduleId,
        date,
        employeeId,
        shiftTypeId
      )
      const assignment2 = StandardShiftAssignment.create(
        shiftScheduleId,
        date,
        employeeId,
        shiftTypeId
      )

      expect(assignment1.id.value).not.toBe(assignment2.id.value)
    })
  })

  describe('reconstruct', () => {
    it('正常に再構成できる', () => {
      const id = ShiftAssignmentId.create()
      const assignment = StandardShiftAssignment.reconstruct(
        id,
        shiftScheduleId,
        date,
        employeeId,
        shiftTypeId
      )

      expect(assignment.id).toBe(id)
      expect(assignment.shiftScheduleId).toBe(shiftScheduleId)
      expect(assignment.employeeId).toBe(employeeId)
      expect(assignment.date).toBe(date)
      expect(assignment.shiftTypeId).toBe(shiftTypeId)
    })
  })
})
