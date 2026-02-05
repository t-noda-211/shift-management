import { EmployeeId } from '@/domain/value-objects/employeeId'
import { ShiftAssignmentDate } from '@/domain/value-objects/shiftAssignmentDate'
import { ShiftNoticeId } from '@/domain/value-objects/shiftNoticeId'
import { ShiftScheduleMonth } from '@/domain/value-objects/shiftScheduleMonth'
import { ShiftScheduleYear } from '@/domain/value-objects/shiftScheduleYear'
import { ShiftTypeId } from '@/domain/value-objects/shiftTypeId'
import { ShiftTypeTime } from '@/domain/value-objects/shiftTypeTime'
import { AppDateTime } from 'shared/appDateTime'
import { setMockNow } from 'shared/testUtils/mockAppDateTime'

import {
  CannotCreatePastShiftScheduleError,
  CannotEditPastShiftScheduleError,
  ShiftAssignmentAlreadyExistsError,
  ShiftAssignmentNotFoundError,
  ShiftNoticeNotFoundError,
  ShiftSchedule,
} from './shiftSchedule'

const mockNowAppDateTime = AppDateTime.from(2026, 6, 15, 12, 0, 0)

// 現在日時を未来にする
const makeFuture = () => setMockNow(AppDateTime.from(2027, 6, 15, 12, 0, 0))

// 更新日時を未来にする
const makeUpdatedAtFuture = () =>
  setMockNow(AppDateTime.from(2026, 6, 15, 20, 0, 0))

const validYear = new ShiftScheduleYear(2026)
const validMonth = new ShiftScheduleMonth(7)

beforeEach(() => {
  setMockNow(mockNowAppDateTime)
})

describe('ShiftSchedule', () => {
  describe('isPublished', () => {
    it('初期状態ではfalseを返す', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)

      expect(schedule.isPublished).toBe(false)
    })
  })

  describe('updatedAt', () => {
    it('更新日時を取得できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)

      expect(schedule.updatedAt.equals(mockNowAppDateTime)).toBe(true)
    })
  })

  describe('create', () => {
    it('新しいShiftScheduleを作成できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)

      expect(schedule.id).toBeTruthy()
      expect(schedule.year).toBe(validYear)
      expect(schedule.month).toBe(validMonth)
      expect(schedule.isPublished).toBe(false)
      expect(schedule.shiftAssignments).toEqual([])
      expect(schedule.shiftNotices).toEqual([])
      expect(schedule.createdAt.equals(mockNowAppDateTime)).toBe(true)
      expect(schedule.updatedAt.equals(mockNowAppDateTime)).toBe(true)
    })

    it('毎回異なるIDが生成される', () => {
      const schedule1 = ShiftSchedule.create(validYear, validMonth)
      const schedule2 = ShiftSchedule.create(validYear, validMonth)

      expect(schedule1.id.value).not.toBe(schedule2.id.value)
    })

    it('現在の年月でcreateすると成功する', () => {
      const year = new ShiftScheduleYear(2026)
      const month = new ShiftScheduleMonth(6)

      const schedule = ShiftSchedule.create(year, month)

      expect(schedule.id).toBeTruthy()
      expect(schedule.year).toBe(year)
      expect(schedule.month).toBe(month)
    })

    it('過去の年月でcreateするとCannotCreatePastShiftScheduleErrorを投げる', () => {
      const year = new ShiftScheduleYear(2020)
      const month = new ShiftScheduleMonth(1)

      expect(() => {
        ShiftSchedule.create(year, month)
      }).toThrow(CannotCreatePastShiftScheduleError)
    })

    it('先月の年月でcreateするとCannotCreatePastShiftScheduleErrorを投げる', () => {
      const year = new ShiftScheduleYear(2026)
      const month = new ShiftScheduleMonth(5)

      expect(() => {
        ShiftSchedule.create(year, month)
      }).toThrow(CannotCreatePastShiftScheduleError)
    })
  })

  describe('assignShift', () => {
    const shiftTypeId = ShiftTypeId.create()

    it('正常にシフトをアサインできる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')

      schedule.assignShift(date, employeeId, shiftTypeId)

      expect(schedule.shiftAssignments).toHaveLength(1)
      expect(schedule.shiftAssignments[0].employeeId).toBe(employeeId)
      expect(schedule.shiftAssignments[0].date).toBe(date)
      expect(schedule.shiftAssignments[0].shiftTypeId).toBe(shiftTypeId)
    })

    it('アサイン後にupdatedAtが更新される', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const initialUpdatedAt = schedule.updatedAt
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')

      makeUpdatedAtFuture()

      schedule.assignShift(date, employeeId, shiftTypeId)

      expect(schedule.updatedAt.isAfter(initialUpdatedAt)).toBe(true)
    })

    it('既に存在するアサインに再度アサインしようとするとエラーを投げる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')

      schedule.assignShift(date, employeeId, shiftTypeId)

      expect(() => {
        schedule.assignShift(date, employeeId, shiftTypeId)
      }).toThrow(ShiftAssignmentAlreadyExistsError)
    })

    it('異なる従業員の同じ日付にはアサインできる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId1 = EmployeeId.create()
      const employeeId2 = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')

      schedule.assignShift(date, employeeId1, shiftTypeId)
      schedule.assignShift(date, employeeId2, shiftTypeId)

      expect(schedule.shiftAssignments).toHaveLength(2)
    })

    it('同じ従業員の異なる日付にはアサインできる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date1 = new ShiftAssignmentDate('2026-07-15')
      const date2 = new ShiftAssignmentDate('2026-07-16')

      schedule.assignShift(date1, employeeId, shiftTypeId)
      schedule.assignShift(date2, employeeId, shiftTypeId)

      expect(schedule.shiftAssignments).toHaveLength(2)
    })

    it('既に公休がアサインされている場合、再度シフトをアサインしようとするとエラーを投げる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')

      schedule.grantPublicHoliday(date, employeeId)

      expect(() => {
        schedule.assignShift(date, employeeId, shiftTypeId)
      }).toThrow(ShiftAssignmentAlreadyExistsError)
    })

    it('既にカスタム時間のシフトがアサインされている場合、再度アサインしようとするとエラーを投げる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')
      const customStartTime = new ShiftTypeTime('09:00')
      const customEndTime = new ShiftTypeTime('17:00')

      schedule.assignShiftWithCustomTime(
        date,
        employeeId,
        customStartTime,
        customEndTime
      )

      expect(() => {
        schedule.assignShift(date, employeeId, shiftTypeId)
      }).toThrow(ShiftAssignmentAlreadyExistsError)
    })

    describe('過去のスケジュールの場合', () => {
      it('過去のスケジュールにアサインしようとするとエラーを投げる', () => {
        const schedule = ShiftSchedule.create(validYear, validMonth)
        // 年月を進める
        makeFuture()
        const employeeId = EmployeeId.create()
        const shiftTypeId = ShiftTypeId.create()
        const date = new ShiftAssignmentDate('2026-06-15')

        expect(() => {
          schedule.assignShift(date, employeeId, shiftTypeId)
        }).toThrow(CannotEditPastShiftScheduleError)
      })
    })
  })

  describe('assignShiftWithCustomTime', () => {
    it('正常にカスタム時間のシフトをアサインできる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')
      const customStartTime = new ShiftTypeTime('09:00')
      const customEndTime = new ShiftTypeTime('17:00')

      schedule.assignShiftWithCustomTime(
        date,
        employeeId,
        customStartTime,
        customEndTime
      )

      expect(schedule.shiftAssignments).toHaveLength(1)
      expect(schedule.shiftAssignments[0].employeeId).toBe(employeeId)
      expect(schedule.shiftAssignments[0].date).toBe(date)
      expect(schedule.shiftAssignments[0].customStartTime).toBe(customStartTime)
      expect(schedule.shiftAssignments[0].customEndTime).toBe(customEndTime)
      expect(schedule.shiftAssignments[0].shiftTypeId).toBeNull()
      expect(schedule.shiftAssignments[0].timeOffType).toBeNull()
    })

    it('アサイン後にupdatedAtが更新される', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const initialUpdatedAt = schedule.updatedAt
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')
      const customStartTime = new ShiftTypeTime('09:00')
      const customEndTime = new ShiftTypeTime('17:00')

      makeUpdatedAtFuture()

      schedule.assignShiftWithCustomTime(
        date,
        employeeId,
        customStartTime,
        customEndTime
      )

      expect(schedule.updatedAt.isAfter(initialUpdatedAt)).toBe(true)
    })

    it('既に存在するアサインに再度アサインしようとするとエラーを投げる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')
      const customStartTime = new ShiftTypeTime('09:00')
      const customEndTime = new ShiftTypeTime('17:00')

      schedule.assignShiftWithCustomTime(
        date,
        employeeId,
        customStartTime,
        customEndTime
      )

      expect(() => {
        schedule.assignShiftWithCustomTime(
          date,
          employeeId,
          customStartTime,
          customEndTime
        )
      }).toThrow(ShiftAssignmentAlreadyExistsError)
    })

    it('異なる従業員の同じ日付にはアサインできる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId1 = EmployeeId.create()
      const employeeId2 = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')
      const customStartTime = new ShiftTypeTime('09:00')
      const customEndTime = new ShiftTypeTime('17:00')

      schedule.assignShiftWithCustomTime(
        date,
        employeeId1,
        customStartTime,
        customEndTime
      )
      schedule.assignShiftWithCustomTime(
        date,
        employeeId2,
        customStartTime,
        customEndTime
      )

      expect(schedule.shiftAssignments).toHaveLength(2)
    })

    it('同じ従業員の異なる日付にはアサインできる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date1 = new ShiftAssignmentDate('2026-07-15')
      const date2 = new ShiftAssignmentDate('2026-07-16')
      const customStartTime = new ShiftTypeTime('09:00')
      const customEndTime = new ShiftTypeTime('17:00')

      schedule.assignShiftWithCustomTime(
        date1,
        employeeId,
        customStartTime,
        customEndTime
      )
      schedule.assignShiftWithCustomTime(
        date2,
        employeeId,
        customStartTime,
        customEndTime
      )

      expect(schedule.shiftAssignments).toHaveLength(2)
    })

    it('既にシフトがアサインされている日付にはカスタム時間でアサインできない', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const shiftTypeId = ShiftTypeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')
      const customStartTime = new ShiftTypeTime('09:00')
      const customEndTime = new ShiftTypeTime('17:00')

      schedule.assignShift(date, employeeId, shiftTypeId)

      expect(() => {
        schedule.assignShiftWithCustomTime(
          date,
          employeeId,
          customStartTime,
          customEndTime
        )
      }).toThrow(ShiftAssignmentAlreadyExistsError)
    })

    it('既に公休がアサインされている場合、カスタム時間のシフトをアサインしようとするとエラーを投げる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')
      const customStartTime = new ShiftTypeTime('09:00')
      const customEndTime = new ShiftTypeTime('17:00')

      schedule.grantPublicHoliday(date, employeeId)

      expect(() => {
        schedule.assignShiftWithCustomTime(
          date,
          employeeId,
          customStartTime,
          customEndTime
        )
      }).toThrow(ShiftAssignmentAlreadyExistsError)
    })

    describe('過去のスケジュールの場合', () => {
      it('過去のスケジュールにアサインしようとするとエラーを投げる', () => {
        const schedule = ShiftSchedule.create(validYear, validMonth)
        // 年月を進める
        makeFuture()
        const employeeId = EmployeeId.create()
        const date = new ShiftAssignmentDate('2026-06-15')
        const customStartTime = new ShiftTypeTime('09:00')
        const customEndTime = new ShiftTypeTime('17:00')

        expect(() => {
          schedule.assignShiftWithCustomTime(
            date,
            employeeId,
            customStartTime,
            customEndTime
          )
        }).toThrow(CannotEditPastShiftScheduleError)
      })
    })
  })

  describe('unassign', () => {
    it('正常にシフトアサインを解除できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')
      const shiftTypeId = ShiftTypeId.create()

      schedule.assignShift(date, employeeId, shiftTypeId)
      expect(schedule.shiftAssignments).toHaveLength(1)

      schedule.unassign(date, employeeId)
      expect(schedule.shiftAssignments).toHaveLength(0)
    })

    it('解除後にupdatedAtが更新される', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')
      const shiftTypeId = ShiftTypeId.create()

      schedule.assignShift(date, employeeId, shiftTypeId)
      const updatedAtAfterAssign = schedule.updatedAt

      makeUpdatedAtFuture()

      schedule.unassign(date, employeeId)

      expect(schedule.updatedAt.isAfter(updatedAtAfterAssign)).toBe(true)
    })

    it('存在しないアサインを解除しようとするとエラーを投げる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')

      expect(() => {
        schedule.unassign(date, employeeId)
      }).toThrow(ShiftAssignmentNotFoundError)
    })

    it('異なる従業員のアサインは解除できない', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId1 = EmployeeId.create()
      const employeeId2 = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')
      const shiftTypeId = ShiftTypeId.create()

      schedule.assignShift(date, employeeId1, shiftTypeId)

      expect(() => {
        schedule.unassign(date, employeeId2)
      }).toThrow(ShiftAssignmentNotFoundError)
    })

    describe('過去のスケジュールの場合', () => {
      it('過去のスケジュールから解除しようとするとエラーを投げる', () => {
        const schedule = ShiftSchedule.create(validYear, validMonth)
        const employeeId = EmployeeId.create()
        const date = new ShiftAssignmentDate('2026-06-15')
        const shiftTypeId = ShiftTypeId.create()
        schedule.assignShift(date, employeeId, shiftTypeId)
        // 年月を進める
        makeFuture()

        expect(() => {
          schedule.unassign(date, employeeId)
        }).toThrow(CannotEditPastShiftScheduleError)
      })
    })
  })

  describe('grantPublicHoliday', () => {
    it('正常に公休を付与できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')

      schedule.grantPublicHoliday(date, employeeId)

      expect(schedule.shiftAssignments).toHaveLength(1)
      expect(schedule.shiftAssignments[0].employeeId).toBe(employeeId)
      expect(schedule.shiftAssignments[0].date).toBe(date)
      expect(schedule.shiftAssignments[0].timeOffType).toBeTruthy()
      expect(schedule.shiftAssignments[0].timeOffType?.isPublicHoliday()).toBe(
        true
      )
    })

    it('付与後にupdatedAtが更新される', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const initialUpdatedAt = schedule.updatedAt
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')

      makeUpdatedAtFuture()

      schedule.grantPublicHoliday(date, employeeId)

      expect(schedule.updatedAt.isAfter(initialUpdatedAt)).toBe(true)
    })

    it('既に存在する公休に再度付与しようとするとエラーを投げる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')

      schedule.grantPublicHoliday(date, employeeId)

      expect(() => {
        schedule.grantPublicHoliday(date, employeeId)
      }).toThrow(ShiftAssignmentAlreadyExistsError)
    })

    it('異なる従業員の同じ日付には付与できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId1 = EmployeeId.create()
      const employeeId2 = EmployeeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')

      schedule.grantPublicHoliday(date, employeeId1)
      schedule.grantPublicHoliday(date, employeeId2)

      expect(schedule.shiftAssignments).toHaveLength(2)
    })

    it('同じ従業員の異なる日付には付与できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const date1 = new ShiftAssignmentDate('2026-07-15')
      const date2 = new ShiftAssignmentDate('2026-07-16')

      schedule.grantPublicHoliday(date1, employeeId)
      schedule.grantPublicHoliday(date2, employeeId)

      expect(schedule.shiftAssignments).toHaveLength(2)
    })

    it('既にシフトがアサインされている日付には公休を付与できない', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const employeeId = EmployeeId.create()
      const shiftTypeId = ShiftTypeId.create()
      const date = new ShiftAssignmentDate('2026-07-15')

      schedule.assignShift(date, employeeId, shiftTypeId)

      expect(() => {
        schedule.grantPublicHoliday(date, employeeId)
      }).toThrow(ShiftAssignmentAlreadyExistsError)
    })

    describe('過去のスケジュールの場合', () => {
      it('過去のスケジュールに付与しようとするとエラーを投げる', () => {
        const schedule = ShiftSchedule.create(validYear, validMonth)
        // 年月を進める
        makeFuture()
        const employeeId = EmployeeId.create()
        const date = new ShiftAssignmentDate('2026-06-15')

        expect(() => {
          schedule.grantPublicHoliday(date, employeeId)
        }).toThrow(CannotEditPastShiftScheduleError)
      })
    })
  })

  describe('publish', () => {
    it('シフトスケジュールを公開できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)

      expect(schedule.isPublished).toBe(false)

      schedule.publish()

      expect(schedule.isPublished).toBe(true)
    })

    it('公開後にupdatedAtが更新される', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const initialUpdatedAt = schedule.updatedAt

      makeUpdatedAtFuture()

      schedule.publish()

      expect(schedule.updatedAt.isAfter(initialUpdatedAt)).toBe(true)
    })

    it('既に公開されている場合でもエラーを投げずに処理できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)

      schedule.publish()
      expect(schedule.isPublished).toBe(true)

      schedule.publish()
      expect(schedule.isPublished).toBe(true)
    })
    describe('過去のスケジュールの場合', () => {
      it('過去のスケジュールでも公開できる', () => {
        const schedule = ShiftSchedule.create(validYear, validMonth)
        // 年月を進める
        makeFuture()
        schedule.publish()
        expect(schedule.isPublished).toBe(true)
      })
    })
  })

  describe('unpublish', () => {
    it('シフトスケジュールを非公開にできる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)

      schedule.publish()
      expect(schedule.isPublished).toBe(true)

      schedule.unpublish()

      expect(schedule.isPublished).toBe(false)
    })

    it('非公開後にupdatedAtが更新される', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)

      schedule.publish()
      const updatedAtAfterPublish = schedule.updatedAt

      makeUpdatedAtFuture()

      schedule.unpublish()

      expect(schedule.updatedAt.isAfter(updatedAtAfterPublish)).toBe(true)
    })

    it('既に非公開の場合でもエラーを投げずに処理できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)

      expect(schedule.isPublished).toBe(false)

      schedule.unpublish()

      expect(schedule.isPublished).toBe(false)
    })

    describe('過去のスケジュールの場合', () => {
      it('過去のスケジュールでも非公開できる', () => {
        const schedule = ShiftSchedule.create(validYear, validMonth)
        schedule.publish()
        // 年月を進める
        makeFuture()
        schedule.unpublish()
        expect(schedule.isPublished).toBe(false)
      })
    })

    it('公開と非公開を繰り返し切り替えできる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)

      expect(schedule.isPublished).toBe(false)

      schedule.publish()
      expect(schedule.isPublished).toBe(true)

      schedule.unpublish()
      expect(schedule.isPublished).toBe(false)

      schedule.publish()
      expect(schedule.isPublished).toBe(true)

      schedule.unpublish()
      expect(schedule.isPublished).toBe(false)
    })
  })

  describe('createNotice', () => {
    it('正常にお知らせを作成できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const title = '来月のシフトについて'
      const content = '来月のシフト希望は25日までに提出してください。'

      schedule.createNotice(title, content)

      expect(schedule.shiftNotices).toHaveLength(1)
      expect(schedule.shiftNotices[0].title).toBe(title)
      expect(schedule.shiftNotices[0].content).toBe(content)
      expect(schedule.shiftNotices[0].shiftScheduleId).toBe(schedule.id)
    })

    it('作成後にupdatedAtが更新される', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const initialUpdatedAt = schedule.updatedAt

      makeUpdatedAtFuture()

      schedule.createNotice('タイトル', '内容')

      expect(schedule.updatedAt.isAfter(initialUpdatedAt)).toBe(true)
    })

    it('複数のお知らせを作成できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)

      schedule.createNotice('タイトル1', '内容1')
      schedule.createNotice('タイトル2', '内容2')
      schedule.createNotice('タイトル3', '内容3')

      expect(schedule.shiftNotices).toHaveLength(3)
      expect(schedule.shiftNotices[0].title).toBe('タイトル1')
      expect(schedule.shiftNotices[1].title).toBe('タイトル2')
      expect(schedule.shiftNotices[2].title).toBe('タイトル3')
    })

    describe('過去のスケジュールの場合', () => {
      it('過去のスケジュールにお知らせを作成しようとするとエラーを投げる', () => {
        const schedule = ShiftSchedule.create(validYear, validMonth)
        // 年月を進める
        makeFuture()
        expect(() => {
          schedule.createNotice('タイトル', '内容')
        }).toThrow(CannotEditPastShiftScheduleError)
      })
    })
  })

  describe('updateNotice', () => {
    it('正常にお知らせのタイトルと内容を更新できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      schedule.createNotice('元のタイトル', '元の内容')
      const noticeId = schedule.shiftNotices[0].id

      schedule.updateNotice(noticeId, '新しいタイトル', '新しい内容')

      expect(schedule.shiftNotices[0].title).toBe('新しいタイトル')
      expect(schedule.shiftNotices[0].content).toBe('新しい内容')
    })

    it('タイトルのみを更新できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      schedule.createNotice('元のタイトル', '元の内容')
      const noticeId = schedule.shiftNotices[0].id
      const originalContent = schedule.shiftNotices[0].content

      schedule.updateNotice(noticeId, '新しいタイトル')

      expect(schedule.shiftNotices[0].title).toBe('新しいタイトル')
      expect(schedule.shiftNotices[0].content).toBe(originalContent)
    })

    it('内容のみを更新できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      schedule.createNotice('元のタイトル', '元の内容')
      const noticeId = schedule.shiftNotices[0].id
      const originalTitle = schedule.shiftNotices[0].title

      schedule.updateNotice(noticeId, undefined, '新しい内容')

      expect(schedule.shiftNotices[0].title).toBe(originalTitle)
      expect(schedule.shiftNotices[0].content).toBe('新しい内容')
    })

    it('更新後にupdatedAtが更新される', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      schedule.createNotice('タイトル', '内容')
      const noticeId = schedule.shiftNotices[0].id
      const updatedAtAfterCreate = schedule.updatedAt

      makeUpdatedAtFuture()

      schedule.updateNotice(noticeId, '新しいタイトル', '新しい内容')

      expect(schedule.updatedAt.isAfter(updatedAtAfterCreate)).toBe(true)
    })

    it('タイトルと内容を更新しない場合、updatedAtが更新されない', async () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      schedule.createNotice('タイトル', '内容')
      const noticeId = schedule.shiftNotices[0].id
      const updatedAtAfterCreate = schedule.updatedAt

      makeUpdatedAtFuture()

      schedule.updateNotice(noticeId)

      expect(schedule.updatedAt.equals(updatedAtAfterCreate)).toBe(true)
    })

    it('存在しないお知らせを更新しようとするとエラーを投げる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const nonExistentId = ShiftNoticeId.create()

      expect(() => {
        schedule.updateNotice(nonExistentId, 'タイトル', '内容')
      }).toThrow(ShiftNoticeNotFoundError)
    })

    it('複数のお知らせがある場合、指定したIDのお知らせのみが更新される', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      schedule.createNotice('タイトル1', '内容1')
      schedule.createNotice('タイトル2', '内容2')
      const noticeId1 = schedule.shiftNotices[0].id

      schedule.updateNotice(noticeId1, '更新されたタイトル1', '更新された内容1')

      expect(schedule.shiftNotices[0].title).toBe('更新されたタイトル1')
      expect(schedule.shiftNotices[0].content).toBe('更新された内容1')
      expect(schedule.shiftNotices[1].title).toBe('タイトル2')
      expect(schedule.shiftNotices[1].content).toBe('内容2')
    })
  })

  describe('deleteNotice', () => {
    it('正常にお知らせを削除できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      schedule.createNotice('タイトル1', '内容1')
      schedule.createNotice('タイトル2', '内容2')
      const noticeId1 = schedule.shiftNotices[0].id

      expect(schedule.shiftNotices).toHaveLength(2)

      schedule.deleteNotice(noticeId1)

      expect(schedule.shiftNotices).toHaveLength(1)
      expect(schedule.shiftNotices[0].title).toBe('タイトル2')
    })

    it('削除後にupdatedAtが更新される', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      schedule.createNotice('タイトル', '内容')
      const noticeId = schedule.shiftNotices[0].id
      const updatedAtAfterCreate = schedule.updatedAt

      makeUpdatedAtFuture()

      schedule.deleteNotice(noticeId)

      expect(schedule.updatedAt.isAfter(updatedAtAfterCreate)).toBe(true)
    })

    it('存在しないお知らせを削除しようとするとエラーを投げる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      const nonExistentId = ShiftNoticeId.create()

      expect(() => {
        schedule.deleteNotice(nonExistentId)
      }).toThrow(ShiftNoticeNotFoundError)
    })

    it('全てのお知らせを削除できる', () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      schedule.createNotice('タイトル1', '内容1')
      schedule.createNotice('タイトル2', '内容2')
      schedule.createNotice('タイトル3', '内容3')

      const noticeId1 = schedule.shiftNotices[0].id
      const noticeId2 = schedule.shiftNotices[1].id
      const noticeId3 = schedule.shiftNotices[2].id

      schedule.deleteNotice(noticeId2)
      expect(schedule.shiftNotices).toHaveLength(2)

      schedule.deleteNotice(noticeId1)
      expect(schedule.shiftNotices).toHaveLength(1)

      schedule.deleteNotice(noticeId3)
      expect(schedule.shiftNotices).toHaveLength(0)
    })
  })
})
