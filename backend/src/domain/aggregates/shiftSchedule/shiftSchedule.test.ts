import { ShiftSchedule } from './shiftSchedule'
import {
  CannotCreatePastShiftScheduleError,
  CannotEditPastShiftScheduleError,
  ShiftAssignmentAlreadyExistsError,
  ShiftAssignmentNotFoundError,
  ShiftNoticeNotFoundError,
} from './shiftSchedule'
import { ShiftScheduleYear } from '@/domain/value-objects/shiftScheduleYear'
import { ShiftScheduleMonth } from '@/domain/value-objects/shiftScheduleMonth'
import { ShiftAssignmentDate } from '@/domain/value-objects/shiftAssignmentDate'
import { EmployeeId } from '@/domain/value-objects/employeeId'
import { ShiftTypeId } from '@/domain/value-objects/shiftTypeId'
import { ShiftTypeTime } from '@/domain/value-objects/shiftTypeTime'
import { ShiftNoticeId } from '@/domain/value-objects/shiftNoticeId'
import { Temporal } from '@js-temporal/polyfill'

// 固定の日時を使用するためのモック
let mockNowZDT: ReturnType<typeof Temporal.ZonedDateTime.from> =
  Temporal.ZonedDateTime.from('2026-06-15T12:00:00+09:00[Asia/Tokyo]')
jest.mock('@js-temporal/polyfill', () => {
  const actual = jest.requireActual<typeof import('@js-temporal/polyfill')>(
    '@js-temporal/polyfill'
  )
  return {
    ...actual,
    Temporal: {
      ...actual.Temporal,
      Now: {
        ...actual.Temporal.Now,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        zonedDateTimeISO: (timeZone: string) => mockNowZDT,
        instant: () => mockNowZDT.toInstant(),
      },
    },
  }
})
const makeFuture = () => {
  mockNowZDT = Temporal.ZonedDateTime.from(
    '2027-06-15T12:00:00+09:00[Asia/Tokyo]'
  )
}

// updatedAtをモックする
let updateInstant: Temporal.Instant = mockNowZDT.toInstant()
jest.mock('@/domain/value-objects/updatedAt', () => {
  const actual = jest.requireActual<
    typeof import('@/domain/value-objects/updatedAt')
  >('@/domain/value-objects/updatedAt')
  return {
    ...actual,
    UpdatedAt: {
      ...actual.UpdatedAt,
      now: () => new actual.UpdatedAt(updateInstant),
    },
  }
})
const mockUpdatedAt = () => {
  updateInstant = Temporal.ZonedDateTime.from(
    '2026-06-15T20:00:00+09:00[Asia/Tokyo]'
  ).toInstant()
}

const validYear = new ShiftScheduleYear(2026)
const validMonth = new ShiftScheduleMonth(7)

afterEach(() => {
  mockNowZDT = Temporal.ZonedDateTime.from(
    '2026-06-15T12:00:00+09:00[Asia/Tokyo]'
  )
  updateInstant = mockNowZDT.toInstant()
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

      expect(schedule.updatedAt).toBeTruthy()
      expect(schedule.updatedAt.value).toBeInstanceOf(Temporal.Instant)
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
      expect(schedule.createdAt).toBeTruthy()
      expect(schedule.updatedAt).toBeTruthy()
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

      mockUpdatedAt()

      schedule.assignShift(date, employeeId, shiftTypeId)

      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        initialUpdatedAt.value
      )
      expect(comparison).toBeGreaterThan(0)
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

      mockUpdatedAt()

      schedule.assignShiftWithCustomTime(
        date,
        employeeId,
        customStartTime,
        customEndTime
      )

      // Temporal.Instantの比較を使用
      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        initialUpdatedAt.value
      )
      expect(comparison).toBeGreaterThan(0)
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

      mockUpdatedAt()

      schedule.unassign(date, employeeId)

      // Temporal.Instantの比較を使用
      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        updatedAtAfterAssign.value
      )
      expect(comparison).toBeGreaterThan(0)
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

      mockUpdatedAt()

      schedule.grantPublicHoliday(date, employeeId)

      // Temporal.Instantの比較を使用
      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        initialUpdatedAt.value
      )
      expect(comparison).toBeGreaterThan(0)
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

      mockUpdatedAt()

      schedule.publish()

      // Temporal.Instantの比較を使用
      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        initialUpdatedAt.value
      )
      expect(comparison).toBeGreaterThan(0)
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

      mockUpdatedAt()

      schedule.unpublish()

      // Temporal.Instantの比較を使用
      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        updatedAtAfterPublish.value
      )
      expect(comparison).toBeGreaterThan(0)
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

      mockUpdatedAt()

      schedule.createNotice('タイトル', '内容')

      // Temporal.Instantの比較を使用
      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        initialUpdatedAt.value
      )
      expect(comparison).toBeGreaterThan(0)
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

      mockUpdatedAt()

      schedule.updateNotice(noticeId, '新しいタイトル', '新しい内容')

      // Temporal.Instantの比較を使用
      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        updatedAtAfterCreate.value
      )
      expect(comparison).toBeGreaterThan(0)
    })

    it('タイトルと内容を更新しない場合、updatedAtが更新されない', async () => {
      const schedule = ShiftSchedule.create(validYear, validMonth)
      schedule.createNotice('タイトル', '内容')
      const noticeId = schedule.shiftNotices[0].id
      const updatedAtAfterCreate = schedule.updatedAt

      // 少し待ってから更新（updatedAtの更新を確認するため）
      await new Promise((resolve) => setTimeout(resolve, 10))
      schedule.updateNotice(noticeId)

      // Temporal.Instantの比較を使用
      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        updatedAtAfterCreate.value
      )
      expect(comparison).toBe(0)
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

      mockUpdatedAt()

      schedule.deleteNotice(noticeId)

      // Temporal.Instantの比較を使用
      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        updatedAtAfterCreate.value
      )
      expect(comparison).toBeGreaterThan(0)
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
