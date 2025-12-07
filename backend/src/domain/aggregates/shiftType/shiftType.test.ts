import { ShiftType, EndTimeMustBeAfterStartTimeError } from './shiftType'
import { ShiftTypeName } from '@/domain/value-objects/shiftTypeName'
import { ShiftTypeTime } from '@/domain/value-objects/shiftTypeTime'

describe('ShiftType', () => {
  describe('constructor', () => {
    it('正常なShiftTypeを作成できる', () => {
      const name = new ShiftTypeName('早番')
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')

      const shiftType = ShiftType.create(name, startTime, endTime)

      expect(shiftType.id).toBeDefined()
      expect(shiftType.name).toBe(name)
      expect(shiftType.startTime).toBe(startTime)
      expect(shiftType.endTime).toBe(endTime)
    })

    it('終業時間が始業時間より前の場合、エラーを投げる', () => {
      const name = new ShiftTypeName('早番')
      const startTime = new ShiftTypeTime('17:00')
      const endTime = new ShiftTypeTime('09:00')

      expect(() => {
        ShiftType.create(name, startTime, endTime)
      }).toThrow(EndTimeMustBeAfterStartTimeError)
    })

    it('終業時間が始業時間と同じ場合、エラーを投げる', () => {
      const name = new ShiftTypeName('早番')
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('09:00')

      expect(() => {
        ShiftType.create(name, startTime, endTime)
      }).toThrow(EndTimeMustBeAfterStartTimeError)
    })
  })

  describe('getDurationHours', () => {
    it('開始時刻と終了時刻の差を時間単位で取得できる', () => {
      const name = new ShiftTypeName('早番')
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')

      const shiftType = ShiftType.create(name, startTime, endTime)

      expect(shiftType.getDurationHours()).toBe(8.0)
    })

    it('30分のシフトの場合、0.5時間を返す', () => {
      const name = new ShiftTypeName('短時間')
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('09:30')

      const shiftType = ShiftType.create(name, startTime, endTime)

      expect(shiftType.getDurationHours()).toBe(0.5)
    })

    it('1時間15分のシフトの場合、1.3時間に切り上げられる', () => {
      const name = new ShiftTypeName('短時間')
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('10:15')

      const shiftType = ShiftType.create(name, startTime, endTime)

      // 1.25時間 → 切り上げ → 1.3時間
      expect(shiftType.getDurationHours()).toBe(1.3)
    })
  })
})
