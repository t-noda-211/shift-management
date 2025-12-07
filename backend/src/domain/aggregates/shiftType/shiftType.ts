import { ShiftTypeId } from '@/domain/value-objects/shiftTypeId'

/**
 * ShiftType エンティティ
 * シフト区分（早番・遅番など）を表す集約ルート
 */
export class ShiftType {
  constructor(
    public readonly id: ShiftTypeId
    // その他のプロパティは後で追加
  ) {}
}
