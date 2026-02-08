import {
  EmployeeId,
  ShiftAssignmentDate,
  ShiftAssignmentId,
  ShiftScheduleId,
  TimeOffType,
} from '@/domain/valueObjects'

import { TimeOffAssignment } from './timeOffAssignment'

describe('TimeOffAssignment', () => {
  const shiftScheduleId = ShiftScheduleId.create()
  const employeeId = EmployeeId.create()
  const date = new ShiftAssignmentDate('2024-01-15')

  describe('create', () => {
    it('公休の休暇アサインを作成できる', () => {
      const timeOffType = TimeOffType.publicHoliday()
      const assignment = TimeOffAssignment.create(
        shiftScheduleId,
        date,
        employeeId,
        timeOffType
      )

      expect(assignment.id).toBeInstanceOf(ShiftAssignmentId)
      expect(assignment.shiftScheduleId).toBe(shiftScheduleId)
      expect(assignment.employeeId).toBe(employeeId)
      expect(assignment.date).toBe(date)
      expect(assignment.timeOffType).toBe(timeOffType)
    })

    it('有給の休暇アサインを作成できる', () => {
      const timeOffType = TimeOffType.paidLeave()
      const assignment = TimeOffAssignment.create(
        shiftScheduleId,
        date,
        employeeId,
        timeOffType
      )

      expect(assignment.timeOffType).toBe(timeOffType)
      expect(assignment.timeOffType?.isPaidLeave()).toBe(true)
    })

    it('毎回新しいIDが生成される', () => {
      const timeOffType = TimeOffType.publicHoliday()
      const assignment1 = TimeOffAssignment.create(
        shiftScheduleId,
        date,
        employeeId,
        timeOffType
      )
      const assignment2 = TimeOffAssignment.create(
        shiftScheduleId,
        date,
        employeeId,
        timeOffType
      )

      expect(assignment1.id.value).not.toBe(assignment2.id.value)
    })
  })

  describe('reconstruct', () => {
    it('正常に再構成できる', () => {
      const id = ShiftAssignmentId.create()
      const timeOffType = TimeOffType.publicHoliday()
      const assignment = TimeOffAssignment.reconstruct(
        id,
        shiftScheduleId,
        date,
        employeeId,
        timeOffType
      )

      expect(assignment.id).toBe(id)
      expect(assignment.shiftScheduleId).toBe(shiftScheduleId)
      expect(assignment.employeeId).toBe(employeeId)
      expect(assignment.date).toBe(date)
      expect(assignment.timeOffType).toBe(timeOffType)
    })
  })
})
