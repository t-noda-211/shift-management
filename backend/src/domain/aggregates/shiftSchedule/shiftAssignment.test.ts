import {
  EmployeeId,
  ShiftAssignmentDate,
  ShiftAssignmentId,
  ShiftScheduleId,
  ShiftTypeId,
  ShiftTypeTime,
  TimeOffType,
} from '@/domain/value-objects'

import { ShiftAssignment } from './shiftAssignment'
import {
  ShiftTypeIdAndCustomTimeConflictError,
  TimeOffTypeAndCustomTimeConflictError,
  CustomTimeIncompleteError,
  EndTimeMustBeAfterStartTimeError,
} from './shiftAssignment'

describe('ShiftAssignment', () => {
  const shiftScheduleId = ShiftScheduleId.create()
  const employeeId = EmployeeId.create()
  const date = new ShiftAssignmentDate('2024-01-15')
  const shiftTypeId = ShiftTypeId.create()

  describe('createWithShiftType', () => {
    it('勤務区分を参照するシフトアサインを作成できる', () => {
      const assignment = ShiftAssignment.createWithShiftType(
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
      expect(assignment.customStartTime).toBeNull()
      expect(assignment.customEndTime).toBeNull()
      expect(assignment.timeOffType).toBeNull()
    })

    it('毎回新しいIDが生成される', () => {
      const assignment1 = ShiftAssignment.createWithShiftType(
        shiftScheduleId,
        date,
        employeeId,
        shiftTypeId
      )
      const assignment2 = ShiftAssignment.createWithShiftType(
        shiftScheduleId,
        date,
        employeeId,
        shiftTypeId
      )

      expect(assignment1.id.value).not.toBe(assignment2.id.value)
    })
  })

  describe('createWithCustomTime', () => {
    it('カスタム勤務時間のシフトアサインを作成できる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('18:00')
      const assignment = ShiftAssignment.createWithCustomTime(
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
      expect(assignment.shiftTypeId).toBeNull()
      expect(assignment.customStartTime).toBe(startTime)
      expect(assignment.customEndTime).toBe(endTime)
      expect(assignment.timeOffType).toBeNull()
    })

    it('終業時間が始業時間と同じ場合、エラーを投げる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('09:00')

      expect(() => {
        ShiftAssignment.createWithCustomTime(
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
        ShiftAssignment.createWithCustomTime(
          shiftScheduleId,
          date,
          employeeId,
          startTime,
          endTime
        )
      }).toThrow(EndTimeMustBeAfterStartTimeError)
    })
  })

  describe('createWithTimeOff', () => {
    it('公休のシフトアサインを作成できる', () => {
      const timeOffType = TimeOffType.publicHoliday()
      const assignment = ShiftAssignment.createWithTimeOff(
        shiftScheduleId,
        date,
        employeeId,
        timeOffType
      )

      expect(assignment.id).toBeInstanceOf(ShiftAssignmentId)
      expect(assignment.shiftScheduleId).toBe(shiftScheduleId)
      expect(assignment.employeeId).toBe(employeeId)
      expect(assignment.date).toBe(date)
      expect(assignment.shiftTypeId).toBeNull()
      expect(assignment.customStartTime).toBeNull()
      expect(assignment.customEndTime).toBeNull()
      expect(assignment.timeOffType).toBe(timeOffType)
    })

    it('有給のシフトアサインを作成できる', () => {
      const timeOffType = TimeOffType.paidLeave()
      const assignment = ShiftAssignment.createWithTimeOff(
        shiftScheduleId,
        date,
        employeeId,
        timeOffType
      )

      expect(assignment.timeOffType).toBe(timeOffType)
      expect(assignment.timeOffType?.isPaidLeave()).toBe(true)
    })
  })

  describe('reconstruct', () => {
    const id = ShiftAssignmentId.create()

    describe('勤務区分を参照するシフトの場合', () => {
      it('正常に再構成できる', () => {
        const assignment = ShiftAssignment.reconstruct(
          id,
          shiftScheduleId,
          date,
          employeeId,
          shiftTypeId,
          null,
          null,
          null
        )

        expect(assignment.id).toBe(id)
        expect(assignment.shiftTypeId).toBe(shiftTypeId)
        expect(assignment.customStartTime).toBeNull()
        expect(assignment.customEndTime).toBeNull()
        expect(assignment.timeOffType).toBeNull()
      })

      it('shiftTypeIdとcustomStartTimeが両方指定されている場合、エラーを投げる', () => {
        const startTime = new ShiftTypeTime('09:00')

        expect(() => {
          ShiftAssignment.reconstruct(
            id,
            shiftScheduleId,
            date,
            employeeId,
            shiftTypeId,
            startTime,
            null,
            null
          )
        }).toThrow(ShiftTypeIdAndCustomTimeConflictError)
      })

      it('shiftTypeIdとcustomEndTimeが両方指定されている場合、エラーを投げる', () => {
        const endTime = new ShiftTypeTime('18:00')

        expect(() => {
          ShiftAssignment.reconstruct(
            id,
            shiftScheduleId,
            date,
            employeeId,
            shiftTypeId,
            null,
            endTime,
            null
          )
        }).toThrow(ShiftTypeIdAndCustomTimeConflictError)
      })

      it('shiftTypeIdとtimeOffTypeが両方指定されている場合、エラーを投げる', () => {
        const timeOffType = TimeOffType.publicHoliday()

        expect(() => {
          ShiftAssignment.reconstruct(
            id,
            shiftScheduleId,
            date,
            employeeId,
            shiftTypeId,
            null,
            null,
            timeOffType
          )
        }).toThrow(ShiftTypeIdAndCustomTimeConflictError)
      })
    })

    describe('休暇の場合', () => {
      it('正常に再構成できる', () => {
        const timeOffType = TimeOffType.publicHoliday()
        const assignment = ShiftAssignment.reconstruct(
          id,
          shiftScheduleId,
          date,
          employeeId,
          null,
          null,
          null,
          timeOffType
        )

        expect(assignment.id).toBe(id)
        expect(assignment.shiftTypeId).toBeNull()
        expect(assignment.customStartTime).toBeNull()
        expect(assignment.customEndTime).toBeNull()
        expect(assignment.timeOffType).toBe(timeOffType)
      })

      it('timeOffTypeとcustomStartTimeが両方指定されている場合、エラーを投げる', () => {
        const timeOffType = TimeOffType.publicHoliday()
        const startTime = new ShiftTypeTime('09:00')

        expect(() => {
          ShiftAssignment.reconstruct(
            id,
            shiftScheduleId,
            date,
            employeeId,
            null,
            startTime,
            null,
            timeOffType
          )
        }).toThrow(TimeOffTypeAndCustomTimeConflictError)
      })

      it('timeOffTypeとcustomEndTimeが両方指定されている場合、エラーを投げる', () => {
        const timeOffType = TimeOffType.publicHoliday()
        const endTime = new ShiftTypeTime('18:00')

        expect(() => {
          ShiftAssignment.reconstruct(
            id,
            shiftScheduleId,
            date,
            employeeId,
            null,
            null,
            endTime,
            timeOffType
          )
        }).toThrow(TimeOffTypeAndCustomTimeConflictError)
      })
    })

    describe('カスタムシフトの場合', () => {
      it('正常に再構成できる', () => {
        const startTime = new ShiftTypeTime('09:00')
        const endTime = new ShiftTypeTime('18:00')
        const assignment = ShiftAssignment.reconstruct(
          id,
          shiftScheduleId,
          date,
          employeeId,
          null,
          startTime,
          endTime,
          null
        )

        expect(assignment.id).toBe(id)
        expect(assignment.shiftTypeId).toBeNull()
        expect(assignment.customStartTime).toBe(startTime)
        expect(assignment.customEndTime).toBe(endTime)
        expect(assignment.timeOffType).toBeNull()
      })

      it('customStartTimeのみ指定されている場合、エラーを投げる', () => {
        const startTime = new ShiftTypeTime('09:00')

        expect(() => {
          ShiftAssignment.reconstruct(
            id,
            shiftScheduleId,
            date,
            employeeId,
            null,
            startTime,
            null,
            null
          )
        }).toThrow(CustomTimeIncompleteError)
      })

      it('customEndTimeのみ指定されている場合、エラーを投げる', () => {
        const endTime = new ShiftTypeTime('18:00')

        expect(() => {
          ShiftAssignment.reconstruct(
            id,
            shiftScheduleId,
            date,
            employeeId,
            null,
            null,
            endTime,
            null
          )
        }).toThrow(CustomTimeIncompleteError)
      })

      it('終業時間が始業時間と同じ場合、エラーを投げる', () => {
        const startTime = new ShiftTypeTime('09:00')
        const endTime = new ShiftTypeTime('09:00')

        expect(() => {
          ShiftAssignment.reconstruct(
            id,
            shiftScheduleId,
            date,
            employeeId,
            null,
            startTime,
            endTime,
            null
          )
        }).toThrow(EndTimeMustBeAfterStartTimeError)
      })

      it('終業時間が始業時間より前の場合、エラーを投げる', () => {
        const startTime = new ShiftTypeTime('18:00')
        const endTime = new ShiftTypeTime('09:00')

        expect(() => {
          ShiftAssignment.reconstruct(
            id,
            shiftScheduleId,
            date,
            employeeId,
            null,
            startTime,
            endTime,
            null
          )
        }).toThrow(EndTimeMustBeAfterStartTimeError)
      })
    })
  })

  describe('isStandardShift', () => {
    it('勤務区分を参照するシフトの場合、trueを返す', () => {
      const assignment = ShiftAssignment.createWithShiftType(
        shiftScheduleId,
        date,
        employeeId,
        shiftTypeId
      )

      expect(assignment.isStandardShift()).toBe(true)
    })

    it('カスタムシフトの場合、falseを返す', () => {
      const assignment = ShiftAssignment.createWithCustomTime(
        shiftScheduleId,
        date,
        employeeId,
        new ShiftTypeTime('09:00'),
        new ShiftTypeTime('18:00')
      )

      expect(assignment.isStandardShift()).toBe(false)
    })

    it('休暇の場合、falseを返す', () => {
      const assignment = ShiftAssignment.createWithTimeOff(
        shiftScheduleId,
        date,
        employeeId,
        TimeOffType.publicHoliday()
      )

      expect(assignment.isStandardShift()).toBe(false)
    })
  })

  describe('isCustomShift', () => {
    it('カスタムシフトの場合、trueを返す', () => {
      const assignment = ShiftAssignment.createWithCustomTime(
        shiftScheduleId,
        date,
        employeeId,
        new ShiftTypeTime('09:00'),
        new ShiftTypeTime('18:00')
      )

      expect(assignment.isCustomShift()).toBe(true)
    })

    it('勤務区分を参照するシフトの場合、falseを返す', () => {
      const assignment = ShiftAssignment.createWithShiftType(
        shiftScheduleId,
        date,
        employeeId,
        shiftTypeId
      )

      expect(assignment.isCustomShift()).toBe(false)
    })

    it('休暇の場合、falseを返す', () => {
      const assignment = ShiftAssignment.createWithTimeOff(
        shiftScheduleId,
        date,
        employeeId,
        TimeOffType.publicHoliday()
      )

      expect(assignment.isCustomShift()).toBe(false)
    })
  })

  describe('isTimeOff', () => {
    it('休暇の場合、trueを返す', () => {
      const assignment = ShiftAssignment.createWithTimeOff(
        shiftScheduleId,
        date,
        employeeId,
        TimeOffType.publicHoliday()
      )

      expect(assignment.isTimeOff()).toBe(true)
    })

    it('勤務区分を参照するシフトの場合、falseを返す', () => {
      const assignment = ShiftAssignment.createWithShiftType(
        shiftScheduleId,
        date,
        employeeId,
        shiftTypeId
      )

      expect(assignment.isTimeOff()).toBe(false)
    })

    it('カスタムシフトの場合、falseを返す', () => {
      const assignment = ShiftAssignment.createWithCustomTime(
        shiftScheduleId,
        date,
        employeeId,
        new ShiftTypeTime('09:00'),
        new ShiftTypeTime('18:00')
      )

      expect(assignment.isTimeOff()).toBe(false)
    })
  })
})
