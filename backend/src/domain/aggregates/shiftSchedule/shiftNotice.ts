import { ShiftNoticeId } from '@/domain/value-objects/shiftNoticeId'
import { ShiftScheduleId } from '@/domain/value-objects/shiftScheduleId'

/**
 * ShiftNotice エンティティ
 * 従業員への事務連絡を表す
 * ShiftSchedule集約に属する
 */
export class ShiftNotice {
  constructor(
    public readonly id: ShiftNoticeId,
    public readonly shiftScheduleId: ShiftScheduleId
    // その他のプロパティは後で追加
  ) {}
}
