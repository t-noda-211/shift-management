import { ShiftScheduleId } from '@/domain/value-objects/shiftScheduleId'

/**
 * ShiftSchedule エンティティ
 * シフト全体を表す集約ルート
 * 1ヶ月に1つ存在する
 */
export class ShiftSchedule {
  constructor(
    public readonly id: ShiftScheduleId
    // その他のプロパティは後で追加
  ) {}
}
