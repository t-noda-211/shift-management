import { TimeOffId } from '@/domain/value-objects/timeOffId'
import { ShiftScheduleId } from '@/domain/value-objects/shiftScheduleId'
import { EmployeeId } from '@/domain/value-objects/employeeId'

/**
 * TimeOff エンティティ
 * 従業員に対する休日の情報を表す
 * ShiftSchedule集約に属する
 * TimeOffTypeで公休や有給を表現する
 */
export class TimeOff {
  constructor(
    public readonly id: TimeOffId,
    public readonly shiftScheduleId: ShiftScheduleId,
    public readonly employeeId: EmployeeId,
    // その他のプロパティは後で追加
  ) {}
}
