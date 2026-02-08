import {
  EmployeeId,
  ShiftAssignmentDate,
  ShiftAssignmentId,
  ShiftScheduleId,
  ShiftTypeId,
} from '@/domain/valueObjects'

/**
 * StandardShiftAssignment エンティティ
 * 従業員のシフト区分に応じたシフト状態を表す
 * ShiftType を参照して標準的な勤務時間を表現する
 */
export class StandardShiftAssignment {
  private constructor(
    public readonly id: ShiftAssignmentId,
    public readonly shiftScheduleId: ShiftScheduleId,
    public readonly date: ShiftAssignmentDate,
    public readonly employeeId: EmployeeId,
    public readonly shiftTypeId: ShiftTypeId
  ) {}

  /**
   * 標準シフトアサインを作成
   */
  static create(
    shiftScheduleId: ShiftScheduleId,
    date: ShiftAssignmentDate,
    employeeId: EmployeeId,
    shiftTypeId: ShiftTypeId
  ): StandardShiftAssignment {
    const id = ShiftAssignmentId.create()
    return new StandardShiftAssignment(
      id,
      shiftScheduleId,
      date,
      employeeId,
      shiftTypeId
    )
  }

  /**
   * 既存の標準シフトアサインを再構成（リポジトリから復元する際に使用）
   */
  static reconstruct(
    id: ShiftAssignmentId,
    shiftScheduleId: ShiftScheduleId,
    date: ShiftAssignmentDate,
    employeeId: EmployeeId,
    shiftTypeId: ShiftTypeId
  ): StandardShiftAssignment {
    return new StandardShiftAssignment(
      id,
      shiftScheduleId,
      date,
      employeeId,
      shiftTypeId
    )
  }
}
