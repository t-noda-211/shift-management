import {
  EmployeeId,
  ShiftAssignmentDate,
  ShiftNoticeId,
  ShiftScheduleId,
  ShiftScheduleMonth,
  ShiftScheduleYear,
  ShiftTypeId,
  ShiftTypeTime,
  TimeOffType,
} from '@/domain/valueObjects'
import { AppDateTime } from 'shared/appDateTime'

import { CustomShiftAssignment } from './customShiftAssignment'
import { ShiftNotice } from './shiftNotice'
import { StandardShiftAssignment } from './standardShiftAssignment'
import { TimeOffAssignment } from './timeOffAssignment'

/**
 * 過去のシフトスケジュールは作成できないエラー
 */
export class CannotCreatePastShiftScheduleError extends AggregateError {
  constructor() {
    super('Cannot create shift schedule in the past')
  }
}

/**
 * 過去のシフトスケジュールは編集できないエラー
 */
export class CannotEditPastShiftScheduleError extends AggregateError {
  constructor() {
    super('Cannot edit past shift schedule')
  }
}

/**
 * アサインが既に存在するエラー
 */
export class AssignmentAlreadyExistsError extends AggregateError {
  constructor() {
    super('Assignment already exists')
  }
}

/**
 * シフトアサインが存在しないエラー
 */
export class ShiftAssignmentNotFoundError extends AggregateError {
  constructor() {
    super('Shift assignment not found')
  }
}

/**
 * お知らせが存在しないエラー
 */
export class ShiftNoticeNotFoundError extends AggregateError {
  constructor() {
    super('Shift notice not found')
  }
}

/**
 * ShiftSchedule エンティティ
 * シフト全体を表す集約ルート
 */
export class ShiftSchedule {
  private constructor(
    public readonly id: ShiftScheduleId,
    public readonly year: ShiftScheduleYear,
    public readonly month: ShiftScheduleMonth,
    private _isPublished: boolean = false,
    public readonly standardShiftAssignments: StandardShiftAssignment[] = [],
    public readonly customShiftAssignments: CustomShiftAssignment[] = [],
    public readonly timeOffAssignments: TimeOffAssignment[] = [],
    public readonly shiftNotices: ShiftNotice[] = [],
    public readonly createdAt: AppDateTime = AppDateTime.now(),
    private _updatedAt: AppDateTime = AppDateTime.now()
  ) {}

  get isPublished(): boolean {
    return this._isPublished
  }

  get updatedAt(): AppDateTime {
    return this._updatedAt
  }

  static create(
    year: ShiftScheduleYear,
    month: ShiftScheduleMonth
  ): ShiftSchedule {
    // 年月が先月以前の場合は作成できない
    const now = AppDateTime.now()
    const thisYear = now.year
    const thisMonth = now.month

    let canCreate = false
    if (year.value > thisYear) {
      canCreate = true
    } else if (year.value === thisYear && month.value >= thisMonth) {
      canCreate = true
    }

    if (!canCreate) {
      throw new CannotCreatePastShiftScheduleError()
    }

    const id = ShiftScheduleId.create()
    return new ShiftSchedule(id, year, month)
  }

  /**
   * 従業員にシフトをアサインする
   */
  assignShift(
    shiftAssignmentDate: ShiftAssignmentDate,
    employeeId: EmployeeId,
    shiftTypeId: ShiftTypeId
  ): void {
    // 過去のシフトスケジュールは編集できない
    if (this.isPast()) {
      throw new CannotEditPastShiftScheduleError()
    }
    // シフトアサインが既に存在する場合はエラーを投げる
    if (this.hasAssignment(shiftAssignmentDate, employeeId)) {
      throw new AssignmentAlreadyExistsError()
    }

    const shiftAssignment = StandardShiftAssignment.create(
      this.id,
      shiftAssignmentDate,
      employeeId,
      shiftTypeId
    )
    this.standardShiftAssignments.push(shiftAssignment)
    this._updatedAt = AppDateTime.now()
  }

  /**
   * カスタム勤務時間のシフトでアサインする
   */
  assignShiftWithCustomTime(
    shiftAssignmentDate: ShiftAssignmentDate,
    employeeId: EmployeeId,
    customStartTime: ShiftTypeTime,
    customEndTime: ShiftTypeTime
  ): void {
    // 過去のシフトスケジュールは編集できない
    if (this.isPast()) {
      throw new CannotEditPastShiftScheduleError()
    }
    // シフトアサインが既に存在する場合はエラーを投げる
    if (this.hasAssignment(shiftAssignmentDate, employeeId)) {
      throw new AssignmentAlreadyExistsError()
    }

    const shiftAssignment = CustomShiftAssignment.create(
      this.id,
      shiftAssignmentDate,
      employeeId,
      customStartTime,
      customEndTime
    )
    this.customShiftAssignments.push(shiftAssignment)
    this._updatedAt = AppDateTime.now()
  }

  /**
   * 従業員の特定の日付のアサインを解除する（勤務か休みかに関わらず）
   * @param shiftAssignmentDate アサイン日
   * @param employeeId 従業員ID
   */
  unassign(
    shiftAssignmentDate: ShiftAssignmentDate,
    employeeId: EmployeeId
  ): void {
    // 過去のシフトスケジュールは編集できない
    if (this.isPast()) {
      throw new CannotEditPastShiftScheduleError()
    }
    // シフトアサインが存在しない場合はエラーを投げる
    if (!this.hasAssignment(shiftAssignmentDate, employeeId)) {
      throw new ShiftAssignmentNotFoundError()
    }

    const index = this.standardShiftAssignments.findIndex(
      (assignment) =>
        assignment.date.equals(shiftAssignmentDate) &&
        assignment.employeeId.equals(employeeId)
    )
    this.standardShiftAssignments.splice(index, 1)
    this._updatedAt = AppDateTime.now()
  }

  /**
   * 従業員に公休を付与する
   * @param shiftAssignmentDate 公休日
   * @param employeeId 従業員ID
   */
  grantPublicHoliday(
    shiftAssignmentDate: ShiftAssignmentDate,
    employeeId: EmployeeId
  ): void {
    // 過去のシフトスケジュールは編集できない
    if (this.isPast()) {
      throw new CannotEditPastShiftScheduleError()
    }
    // シフトアサインが既に存在する場合はエラーを投げる
    if (this.hasAssignment(shiftAssignmentDate, employeeId)) {
      throw new AssignmentAlreadyExistsError()
    }

    const timeOffType = TimeOffType.publicHoliday()
    const shiftAssignment = TimeOffAssignment.create(
      this.id,
      shiftAssignmentDate,
      employeeId,
      timeOffType
    )
    this.timeOffAssignments.push(shiftAssignment)
    this._updatedAt = AppDateTime.now()
  }

  /**
   * シフトスケジュールを公開する
   */
  publish(): void {
    if (this._isPublished) {
      return
    }
    this._isPublished = true
    this._updatedAt = AppDateTime.now()
  }

  /**
   * シフトスケジュールを非公開にする
   */
  unpublish(): void {
    if (!this._isPublished) {
      return
    }
    this._isPublished = false
    this._updatedAt = AppDateTime.now()
  }

  /**
   * このシフトスケジュールが過去（今月より前）の年月かどうかを判定する
   * @returns trueなら過去
   */
  private isPast(): boolean {
    // JST（Asia/Tokyo）で現在の日付を取得
    const now = AppDateTime.now()
    const currentYear = now.year
    const currentMonth = now.month
    const scheduleYear = this.year.value
    const scheduleMonth = this.month.value

    if (scheduleYear < currentYear) {
      return true
    }
    if (scheduleYear === currentYear && scheduleMonth < currentMonth) {
      return true
    }
    return false
  }

  /**
   * 従業員と日付に紐づくアサインが存在するかどうかを判定する
   * @param shiftAssignmentDate アサイン日
   * @param employeeId 従業員ID
   * @returns 存在する場合はtrue、存在しない場合はfalse
   */
  private hasAssignment(
    shiftAssignmentDate: ShiftAssignmentDate,
    employeeId: EmployeeId
  ): boolean {
    const existsStandardShiftAssignment = this.standardShiftAssignments.some(
      (assignment) =>
        assignment.date.equals(shiftAssignmentDate) &&
        assignment.employeeId.equals(employeeId)
    )
    const existsCustomShiftAssignment = this.customShiftAssignments.some(
      (assignment) =>
        assignment.date.equals(shiftAssignmentDate) &&
        assignment.employeeId.equals(employeeId)
    )
    const existsTimeOffAssignment = this.timeOffAssignments.some(
      (assignment) =>
        assignment.date.equals(shiftAssignmentDate) &&
        assignment.employeeId.equals(employeeId)
    )
    return (
      existsStandardShiftAssignment ||
      existsCustomShiftAssignment ||
      existsTimeOffAssignment
    )
  }

  // ================================================
  // お知らせ
  // ================================================
  /**
   * お知らせ（ShiftNotice）を作成して追加する
   * @param title お知らせタイトル
   * @param content お知らせ本文
   */
  createNotice(title: string, content: string): void {
    // 過去のシフトスケジュールは編集できない
    if (this.isPast()) {
      throw new CannotEditPastShiftScheduleError()
    }

    const notice = ShiftNotice.create(this.id, title, content)
    this.shiftNotices.push(notice)
    this._updatedAt = AppDateTime.now()
  }

  /**
   * お知らせ（ShiftNotice）を更新する
   * @param id お知らせID
   * @param title お知らせタイトル
   * @param content お知らせ本文
   */
  updateNotice(id: ShiftNoticeId, title?: string, content?: string): void {
    // 過去のシフトスケジュールは編集できない
    if (this.isPast()) {
      throw new CannotEditPastShiftScheduleError()
    }

    const notice = this.shiftNotices.find((notice) => notice.id.equals(id))
    if (!notice) {
      throw new ShiftNoticeNotFoundError()
    }

    if (title) notice.updateTitle(title)
    if (content) notice.updateContent(content)
    if (title || content) {
      this._updatedAt = AppDateTime.now()
    }
  }

  /**
   * お知らせ（ShiftNotice）を削除する
   * @param id お知らせID
   */
  deleteNotice(id: ShiftNoticeId): void {
    // 過去のシフトスケジュールは編集できない
    if (this.isPast()) {
      throw new CannotEditPastShiftScheduleError()
    }

    const index = this.shiftNotices.findIndex((notice) => notice.id.equals(id))
    if (index === -1) {
      throw new ShiftNoticeNotFoundError()
    }

    this.shiftNotices.splice(index, 1)
    this._updatedAt = AppDateTime.now()
  }
}
