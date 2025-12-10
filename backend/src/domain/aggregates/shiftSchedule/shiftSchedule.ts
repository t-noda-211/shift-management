import { ShiftScheduleId } from '@/domain/value-objects/shiftScheduleId'
import { ShiftScheduleYear } from '@/domain/value-objects/shiftScheduleYear'
import { ShiftScheduleMonth } from '@/domain/value-objects/shiftScheduleMonth'
import { ShiftAssignment } from './shiftAssignment'
import { ShiftNotice } from './shiftNotice'
import { ShiftAssignmentDate } from '@/domain/value-objects/shiftAssignmentDate'
import { EmployeeId } from '@/domain/value-objects/employeeId'
import { ShiftTypeId } from '@/domain/value-objects/shiftTypeId'
import { CreatedAt } from '@/domain/value-objects/createdAt'
import { UpdatedAt } from '@/domain/value-objects/updatedAt'
import { TimeOffType } from '@/domain/value-objects/timeOffType'

/**
 * 過去のシフトスケジュールは編集できないエラー
 */
export class CannotEditPastShiftScheduleError extends AggregateError {
  constructor() {
    super('Cannot edit past shift schedule')
  }
}

/**
 * シフトアサインが既に存在するエラー
 */
export class ShiftAssignmentAlreadyExistsError extends AggregateError {
  constructor() {
    super('Shift assignment already exists')
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
 * ShiftSchedule エンティティ
 * シフト全体を表す集約ルート
 */
export class ShiftSchedule {
  private constructor(
    public readonly id: ShiftScheduleId,
    public readonly year: ShiftScheduleYear,
    public readonly month: ShiftScheduleMonth,
    private _isPublished: boolean = false,
    public readonly shiftAssignments: ShiftAssignment[] = [],
    public readonly shiftNotices: ShiftNotice[] = [],
    public readonly createdAt: CreatedAt = CreatedAt.now(),
    private _updatedAt: UpdatedAt = UpdatedAt.now()
  ) {}

  get isPublished(): boolean {
    return this._isPublished
  }

  get updatedAt(): UpdatedAt {
    return this._updatedAt
  }

  static create(
    year: ShiftScheduleYear,
    month: ShiftScheduleMonth
  ): ShiftSchedule {
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
      throw new ShiftAssignmentAlreadyExistsError()
    }

    const shiftAssignment = ShiftAssignment.createWithShiftType(
      this.id,
      shiftAssignmentDate,
      employeeId,
      shiftTypeId
    )
    this.shiftAssignments.push(shiftAssignment)
    this._updatedAt = UpdatedAt.now()
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

    const index = this.shiftAssignments.findIndex(
      (assignment) =>
        assignment.date.equals(shiftAssignmentDate) &&
        assignment.employeeId.equals(employeeId)
    )
    this.shiftAssignments.splice(index, 1)
    this._updatedAt = UpdatedAt.now()
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
      throw new ShiftAssignmentAlreadyExistsError()
    }

    const timeOffType = TimeOffType.publicHoliday()
    const shiftAssignment = ShiftAssignment.createWithTimeOff(
      this.id,
      shiftAssignmentDate,
      employeeId,
      timeOffType
    )
    this.shiftAssignments.push(shiftAssignment)
    this._updatedAt = UpdatedAt.now()
  }

  /**
   * シフトスケジュールを公開する
   */
  publish(): void {
    if (this._isPublished) {
      return
    }
    this._isPublished = true
    this._updatedAt = UpdatedAt.now()
  }

  /**
   * シフトスケジュールを非公開にする
   */
  unpublish(): void {
    if (!this._isPublished) {
      return
    }
    this._isPublished = false
    this._updatedAt = UpdatedAt.now()
  }

  /**
   * このシフトスケジュールが過去（今日より前）の年月かどうかを判定する
   * @returns trueなら過去
   */
  private isPast(): boolean {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
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
   * 指定した従業員IDとシフトアサイン日が存在するかどうかを判定する
   * @param shiftAssignmentDate アサイン日
   * @param employeeId 従業員ID
   * @returns 存在する場合はtrue、存在しない場合はfalse
   */
  private hasAssignment(
    shiftAssignmentDate: ShiftAssignmentDate,
    employeeId: EmployeeId
  ): boolean {
    return this.shiftAssignments.some(
      (assignment) =>
        assignment.date.equals(shiftAssignmentDate) &&
        assignment.employeeId.equals(employeeId)
    )
  }
}
