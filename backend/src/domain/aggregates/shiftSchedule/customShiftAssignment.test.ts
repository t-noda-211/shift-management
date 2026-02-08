import {
  EmployeeId,
  ShiftAssignmentDate,
  ShiftAssignmentId,
  ShiftScheduleId,
  ShiftTypeTime,
} from '@/domain/valueObjects'

import {
  CustomShiftAssignment,
  EndTimeMustBeAfterStartTimeError,
} from './customShiftAssignment'

describe('CustomShiftAssignment', () => {
  const shiftScheduleId = ShiftScheduleId.create()
  const employeeId = EmployeeId.create()
  const date = new ShiftAssignmentDate('2024-01-15')

  describe('create', () => {
    it('カスタムシフトアサインを作成できる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('18:00')
      const assignment = CustomShiftAssignment.create(
        shiftScheduleId,
        date,
        employeeId,
        startTime,
        endTime
      )

      expect(assignment.id).toBeInstanceOf(ShiftAssignmentId)
      expect(assignment.shiftScheduleId).toBe(shiftScheduleId)
      expect(assignment.employeeId).toBe(employeeId)
      expect(assignment.date).toBe(date)
      expect(assignment.customStartTime).toBe(startTime)
      expect(assignment.customEndTime).toBe(endTime)
    })

    it('毎回新しいIDが生成される', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('18:00')
      const assignment1 = CustomShiftAssignment.create(
        shiftScheduleId,
        date,
        employeeId,
        startTime,
        endTime
      )
      const assignment2 = CustomShiftAssignment.create(
        shiftScheduleId,
        date,
        employeeId,
        startTime,
        endTime
      )

      expect(assignment1.id.value).not.toBe(assignment2.id.value)
    })

    it('終業時間が始業時間と同じ場合、エラーを投げる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('09:00')

      expect(() => {
        CustomShiftAssignment.create(
          shiftScheduleId,
          date,
          employeeId,
          startTime,
          endTime
        )
      }).toThrow(EndTimeMustBeAfterStartTimeError)
    })

    it('終業時間が始業時間より前の場合、エラーを投げる', () => {
      const startTime = new ShiftTypeTime('18:00')
      const endTime = new ShiftTypeTime('09:00')

      expect(() => {
        CustomShiftAssignment.create(
          shiftScheduleId,
          date,
          employeeId,
          startTime,
          endTime
        )
      }).toThrow(EndTimeMustBeAfterStartTimeError)
    })
  })

  describe('reconstruct', () => {
    it('正常に再構成できる', () => {
      const id = ShiftAssignmentId.create()
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('18:00')
      const assignment = CustomShiftAssignment.reconstruct(
        id,
        shiftScheduleId,
        date,
        employeeId,
        startTime,
        endTime
      )

      expect(assignment.id).toBe(id)
      expect(assignment.shiftScheduleId).toBe(shiftScheduleId)
      expect(assignment.employeeId).toBe(employeeId)
      expect(assignment.date).toBe(date)
      expect(assignment.customStartTime).toBe(startTime)
      expect(assignment.customEndTime).toBe(endTime)
    })

    it('終業時間が始業時間と同じ場合、エラーを投げる', () => {
      const id = ShiftAssignmentId.create()
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('09:00')

      expect(() => {
        CustomShiftAssignment.reconstruct(
          id,
          shiftScheduleId,
          date,
          employeeId,
          startTime,
          endTime
        )
      }).toThrow(EndTimeMustBeAfterStartTimeError)
    })

    it('終業時間が始業時間より前の場合、エラーを投げる', () => {
      const id = ShiftAssignmentId.create()
      const startTime = new ShiftTypeTime('18:00')
      const endTime = new ShiftTypeTime('09:00')

      expect(() => {
        CustomShiftAssignment.reconstruct(
          id,
          shiftScheduleId,
          date,
          employeeId,
          startTime,
          endTime
        )
      }).toThrow(EndTimeMustBeAfterStartTimeError)
    })
  })
})
