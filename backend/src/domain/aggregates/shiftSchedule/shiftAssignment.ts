import { ShiftAssignmentId } from '@/domain/value-objects/shiftAssignmentId'
import { ShiftScheduleId } from '@/domain/value-objects/shiftScheduleId'
import { EmployeeId } from '@/domain/value-objects/employeeId'

/**
 * ShiftAssignment エンティティ
 * 従業員に対するシフトのアサイン情報を表す
 * ShiftSchedule集約に属する
 */
export class ShiftAssignment {
  constructor(
    public readonly id: ShiftAssignmentId,
    public readonly shiftScheduleId: ShiftScheduleId,
    public readonly employeeId: EmployeeId
    // その他のプロパティは後で追加
  ) {}
}
