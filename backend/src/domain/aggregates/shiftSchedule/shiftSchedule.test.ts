import { ShiftSchedule } from './shiftSchedule'
import {
  CannotEditPastShiftScheduleError,
  ShiftAssignmentAlreadyExistsError,
  ShiftAssignmentNotFoundError,
} from './shiftSchedule'
import { ShiftScheduleYear } from '@/domain/value-objects/shiftScheduleYear'
import { ShiftScheduleMonth } from '@/domain/value-objects/shiftScheduleMonth'
import { ShiftAssignmentDate } from '@/domain/value-objects/shiftAssignmentDate'
import { EmployeeId } from '@/domain/value-objects/employeeId'
import { ShiftTypeId } from '@/domain/value-objects/shiftTypeId'
import { Temporal } from '@js-temporal/polyfill'

describe('ShiftSchedule', () => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  // テスト用の未来の年月を生成（現在の年月より後）
  const getFutureYear = (): number => {
    return Math.max(2026, currentYear + 1)
  }

  const getFutureMonth = (): number => {
    if (currentYear < getFutureYear()) {
      return 1
    }
    return currentMonth < 12 ? currentMonth + 1 : 1
  }

  // テスト用の過去の年月を生成（現在の年月より前）
  // 確実に過去になるように、現在の年月より前の年月を使用
  const getPastYear = (): number | null => {
    // 現在の年が2026より大きい場合は、現在の年-1を使用
    if (currentYear > 2026) {
      return currentYear - 1
    }
    // 現在の年が2026の場合、月が1より大きい場合は2026年を使用
    if (currentYear === 2026 && currentMonth > 1) {
      return 2026
    }
    // 過去の年月が生成できない場合はnullを返す
    return null
  }

  const getPastMonth = (): number | null => {
    const pastYear = getPastYear()
    if (pastYear === null) {
      return null
    }
    if (currentYear > pastYear) {
      // 過去の年なので、任意の月（12月）を使用
      return 12
    }
    // 同じ年の場合、現在の月より前の月を使用
    return currentMonth > 1 ? currentMonth - 1 : null
  }

  describe('create', () => {
    it('新しいShiftScheduleを作成できる', () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)

      expect(schedule.id).toBeTruthy()
      expect(schedule.year).toBe(year)
      expect(schedule.month).toBe(month)
      expect(schedule.isPublished).toBe(false)
      expect(schedule.shiftAssignments).toEqual([])
      expect(schedule.shiftNotices).toEqual([])
      expect(schedule.createdAt).toBeTruthy()
      expect(schedule.updatedAt).toBeTruthy()
    })

    it('毎回異なるIDが生成される', () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule1 = ShiftSchedule.create(year, month)
      const schedule2 = ShiftSchedule.create(year, month)

      expect(schedule1.id.value).not.toBe(schedule2.id.value)
    })
  })

  describe('assignShift', () => {
    const year = new ShiftScheduleYear(getFutureYear())
    const month = new ShiftScheduleMonth(getFutureMonth())
    const schedule = ShiftSchedule.create(year, month)
    const employeeId = EmployeeId.create()
    const shiftTypeId = ShiftTypeId.create()
    const date = new ShiftAssignmentDate(
      `${getFutureYear()}-${String(getFutureMonth()).padStart(2, '0')}-15`
    )

    it('正常にシフトをアサインできる', () => {
      schedule.assignShift(date, employeeId, shiftTypeId)

      expect(schedule.shiftAssignments).toHaveLength(1)
      expect(schedule.shiftAssignments[0].employeeId).toBe(employeeId)
      expect(schedule.shiftAssignments[0].date).toBe(date)
      expect(schedule.shiftAssignments[0].shiftTypeId).toBe(shiftTypeId)
    })

    it('アサイン後にupdatedAtが更新される', async () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)
      const initialUpdatedAt = schedule.updatedAt

      // 少し待ってからアサイン（updatedAtの更新を確認するため）
      await new Promise((resolve) => setTimeout(resolve, 10))
      schedule.assignShift(date, employeeId, shiftTypeId)

      // Temporal.Instantの比較を使用
      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        initialUpdatedAt.value
      )
      expect(comparison).toBeGreaterThan(0)
    })

    it('既に存在するアサインに再度アサインしようとするとエラーを投げる', () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)
      const employeeId = EmployeeId.create()
      const shiftTypeId = ShiftTypeId.create()
      const date = new ShiftAssignmentDate(
        `${getFutureYear()}-${String(getFutureMonth()).padStart(2, '0')}-15`
      )

      schedule.assignShift(date, employeeId, shiftTypeId)

      expect(() => {
        schedule.assignShift(date, employeeId, shiftTypeId)
      }).toThrow(ShiftAssignmentAlreadyExistsError)
    })

    it('異なる従業員の同じ日付にはアサインできる', () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)
      const employeeId1 = EmployeeId.create()
      const employeeId2 = EmployeeId.create()
      const shiftTypeId = ShiftTypeId.create()
      const date = new ShiftAssignmentDate(
        `${getFutureYear()}-${String(getFutureMonth()).padStart(2, '0')}-15`
      )

      schedule.assignShift(date, employeeId1, shiftTypeId)
      schedule.assignShift(date, employeeId2, shiftTypeId)

      expect(schedule.shiftAssignments).toHaveLength(2)
    })

    it('同じ従業員の異なる日付にはアサインできる', () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)
      const employeeId = EmployeeId.create()
      const shiftTypeId = ShiftTypeId.create()
      const date1 = new ShiftAssignmentDate(
        `${getFutureYear()}-${String(getFutureMonth()).padStart(2, '0')}-15`
      )
      const date2 = new ShiftAssignmentDate(
        `${getFutureYear()}-${String(getFutureMonth()).padStart(2, '0')}-16`
      )

      schedule.assignShift(date1, employeeId, shiftTypeId)
      schedule.assignShift(date2, employeeId, shiftTypeId)

      expect(schedule.shiftAssignments).toHaveLength(2)
    })

    describe('過去のスケジュールの場合', () => {
      it('過去のスケジュールにアサインしようとするとエラーを投げる', () => {
        // 過去の年月でスケジュールを作成（確実に過去になるように）
        const pastYearValue = getPastYear()
        const pastMonthValue = getPastMonth()

        // 過去の年月が生成できない場合はスキップ
        if (pastYearValue === null || pastMonthValue === null) {
          // テストをスキップ（過去の年月が生成できない場合）
          return
        }

        const pastYear = new ShiftScheduleYear(pastYearValue)
        const pastMonth = new ShiftScheduleMonth(pastMonthValue)
        const schedule = ShiftSchedule.create(pastYear, pastMonth)
        const employeeId = EmployeeId.create()
        const shiftTypeId = ShiftTypeId.create()
        const date = new ShiftAssignmentDate(
          `${pastYearValue}-${String(pastMonthValue).padStart(2, '0')}-15`
        )

        expect(() => {
          schedule.assignShift(date, employeeId, shiftTypeId)
        }).toThrow(CannotEditPastShiftScheduleError)
      })
    })
  })

  describe('unassignShift', () => {
    it('正常にシフトアサインを解除できる', () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)
      const employeeId = EmployeeId.create()
      const shiftTypeId = ShiftTypeId.create()
      const date = new ShiftAssignmentDate(
        `${getFutureYear()}-${String(getFutureMonth()).padStart(2, '0')}-15`
      )

      schedule.assignShift(date, employeeId, shiftTypeId)
      expect(schedule.shiftAssignments).toHaveLength(1)

      schedule.unassignShift(date, employeeId)
      expect(schedule.shiftAssignments).toHaveLength(0)
    })

    it('解除後にupdatedAtが更新される', async () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)
      const employeeId = EmployeeId.create()
      const shiftTypeId = ShiftTypeId.create()
      const date = new ShiftAssignmentDate(
        `${getFutureYear()}-${String(getFutureMonth()).padStart(2, '0')}-15`
      )

      schedule.assignShift(date, employeeId, shiftTypeId)
      const updatedAtAfterAssign = schedule.updatedAt

      // 少し待ってから解除（updatedAtの更新を確認するため）
      await new Promise((resolve) => setTimeout(resolve, 10))
      schedule.unassignShift(date, employeeId)

      // Temporal.Instantの比較を使用
      const comparison = Temporal.Instant.compare(
        schedule.updatedAt.value,
        updatedAtAfterAssign.value
      )
      expect(comparison).toBeGreaterThan(0)
    })

    it('存在しないアサインを解除しようとするとエラーを投げる', () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)
      const employeeId = EmployeeId.create()
      const date = new ShiftAssignmentDate(
        `${getFutureYear()}-${String(getFutureMonth()).padStart(2, '0')}-15`
      )

      expect(() => {
        schedule.unassignShift(date, employeeId)
      }).toThrow(ShiftAssignmentNotFoundError)
    })

    it('異なる従業員のアサインは解除できない', () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)
      const employeeId1 = EmployeeId.create()
      const employeeId2 = EmployeeId.create()
      const shiftTypeId = ShiftTypeId.create()
      const date = new ShiftAssignmentDate(
        `${getFutureYear()}-${String(getFutureMonth()).padStart(2, '0')}-15`
      )

      schedule.assignShift(date, employeeId1, shiftTypeId)

      expect(() => {
        schedule.unassignShift(date, employeeId2)
      }).toThrow(ShiftAssignmentNotFoundError)
    })

    it('異なる日付のアサインは解除できない', () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)
      const employeeId = EmployeeId.create()
      const shiftTypeId = ShiftTypeId.create()
      const date1 = new ShiftAssignmentDate(
        `${getFutureYear()}-${String(getFutureMonth()).padStart(2, '0')}-15`
      )
      const date2 = new ShiftAssignmentDate(
        `${getFutureYear()}-${String(getFutureMonth()).padStart(2, '0')}-16`
      )

      schedule.assignShift(date1, employeeId, shiftTypeId)

      expect(() => {
        schedule.unassignShift(date2, employeeId)
      }).toThrow(ShiftAssignmentNotFoundError)
    })

    describe('過去のスケジュールの場合', () => {
      it('過去のスケジュールから解除しようとするとエラーを投げる', () => {
        // 過去の年月でスケジュールを作成（確実に過去になるように）
        const pastYearValue = getPastYear()
        const pastMonthValue = getPastMonth()

        // 過去の年月が生成できない場合はスキップ
        if (pastYearValue === null || pastMonthValue === null) {
          // テストをスキップ（過去の年月が生成できない場合）
          return
        }

        const pastYear = new ShiftScheduleYear(pastYearValue)
        const pastMonth = new ShiftScheduleMonth(pastMonthValue)
        const schedule = ShiftSchedule.create(pastYear, pastMonth)
        const employeeId = EmployeeId.create()
        const date = new ShiftAssignmentDate(
          `${pastYearValue}-${String(pastMonthValue).padStart(2, '0')}-15`
        )

        expect(() => {
          schedule.unassignShift(date, employeeId)
        }).toThrow(CannotEditPastShiftScheduleError)
      })
    })
  })

  describe('isPublished', () => {
    it('初期状態ではfalseを返す', () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)

      expect(schedule.isPublished).toBe(false)
    })
  })

  describe('updatedAt', () => {
    it('更新日時を取得できる', () => {
      const year = new ShiftScheduleYear(getFutureYear())
      const month = new ShiftScheduleMonth(getFutureMonth())
      const schedule = ShiftSchedule.create(year, month)

      expect(schedule.updatedAt).toBeTruthy()
      expect(schedule.updatedAt.value).toBeInstanceOf(Temporal.Instant)
    })
  })
})
