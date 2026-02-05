import { ShiftTypeId } from '@/domain/value-objects/shiftTypeId'
import { ShiftTypeName } from '@/domain/value-objects/shiftTypeName'
import { ShiftTypeTime } from '@/domain/value-objects/shiftTypeTime'

import { ShiftType, EndTimeMustBeAfterStartTimeError } from './shiftType'

describe('ShiftType', () => {
  describe('create', () => {
    it('正常なShiftTypeを作成できる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')

      const shiftType = ShiftType.create('早番', startTime, endTime)

      expect(shiftType.id).toBeDefined()
      expect(shiftType.name).toBe('早番')
      expect(shiftType.startTime).toBe(startTime)
      expect(shiftType.endTime).toBe(endTime)
    })

    it('終業時間が始業時間より前の場合、エラーを投げる', () => {
      const startTime = new ShiftTypeTime('17:00')
      const endTime = new ShiftTypeTime('09:00')

      expect(() => {
        ShiftType.create('早番', startTime, endTime)
      }).toThrow(EndTimeMustBeAfterStartTimeError)
    })

    it('終業時間が始業時間と同じ場合、エラーを投げる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('09:00')

      expect(() => {
        ShiftType.create('早番', startTime, endTime)
      }).toThrow(EndTimeMustBeAfterStartTimeError)
    })
  })

  describe('getDurationHours', () => {
    it('開始時刻と終了時刻の差を時間単位で取得できる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')

      const shiftType = ShiftType.create('早番', startTime, endTime)

      expect(shiftType.getDurationHours()).toBe(8.0)
    })

    it('30分のシフトの場合、0.5時間を返す', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('09:30')

      const shiftType = ShiftType.create('短時間', startTime, endTime)

      expect(shiftType.getDurationHours()).toBe(0.5)
    })

    it('1時間15分のシフトの場合、1.3時間に切り上げられる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('10:15')

      const shiftType = ShiftType.create('短時間', startTime, endTime)

      // 1.25時間 → 切り上げ → 1.3時間
      expect(shiftType.getDurationHours()).toBe(1.3)
    })

    it('1時間1分のシフトの場合、1.1時間に切り上げられる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('10:01')

      const shiftType = ShiftType.create('短時間', startTime, endTime)

      // 1.016...時間 → 切り上げ → 1.1時間
      expect(shiftType.getDurationHours()).toBe(1.1)
    })

    it('ちょうど整数時間のシフトの場合、そのまま返す', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('12:00')

      const shiftType = ShiftType.create('通常', startTime, endTime)

      expect(shiftType.getDurationHours()).toBe(3.0)
    })

    it('1分のシフトの場合、0.1時間に切り上げられる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('09:01')

      const shiftType = ShiftType.create('超短時間', startTime, endTime)

      // 0.016...時間 → 切り上げ → 0.1時間
      expect(shiftType.getDurationHours()).toBe(0.1)
    })

    it('長時間のシフト（8時間30分）の場合、8.5時間を返す', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:30')

      const shiftType = ShiftType.create('長時間', startTime, endTime)

      expect(shiftType.getDurationHours()).toBe(8.5)
    })

    it('長時間のシフト（8時間31分）の場合、8.6時間に切り上げられる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:31')

      const shiftType = ShiftType.create('長時間', startTime, endTime)

      // 8.516...時間 → 切り上げ → 8.6時間
      expect(shiftType.getDurationHours()).toBe(8.6)
    })
  })

  describe('from', () => {
    it('既存のIDと値オブジェクトからShiftTypeを作成できる', () => {
      const id = ShiftTypeId.create()
      const name = new ShiftTypeName('早番')
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')

      const shiftType = ShiftType.from(id, name, startTime, endTime)

      expect(shiftType.id).toBe(id)
      expect(shiftType.name).toBe('早番')
      expect(shiftType.startTime).toBe(startTime)
      expect(shiftType.endTime).toBe(endTime)
    })
  })

  describe('updateName', () => {
    it('名前を正常に更新できる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')
      const shiftType = ShiftType.create('早番', startTime, endTime)

      shiftType.updateName('遅番')

      expect(shiftType.name).toBe('遅番')
    })

    it('複数回名前を更新できる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')
      const shiftType = ShiftType.create('早番', startTime, endTime)

      shiftType.updateName('遅番')
      expect(shiftType.name).toBe('遅番')

      shiftType.updateName('夜勤')
      expect(shiftType.name).toBe('夜勤')
    })
  })

  describe('updateTime', () => {
    it('時間を正常に更新できる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')
      const shiftType = ShiftType.create('早番', startTime, endTime)

      const newStartTime = new ShiftTypeTime('10:00')
      const newEndTime = new ShiftTypeTime('18:00')
      shiftType.updateTime(newStartTime, newEndTime)

      expect(shiftType.startTime).toBe(newStartTime)
      expect(shiftType.endTime).toBe(newEndTime)
    })

    it('複数回時間を更新できる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')
      const shiftType = ShiftType.create('早番', startTime, endTime)

      const firstStartTime = new ShiftTypeTime('10:00')
      const firstEndTime = new ShiftTypeTime('18:00')
      shiftType.updateTime(firstStartTime, firstEndTime)
      expect(shiftType.startTime).toBe(firstStartTime)
      expect(shiftType.endTime).toBe(firstEndTime)

      const secondStartTime = new ShiftTypeTime('11:00')
      const secondEndTime = new ShiftTypeTime('19:00')
      shiftType.updateTime(secondStartTime, secondEndTime)
      expect(shiftType.startTime).toBe(secondStartTime)
      expect(shiftType.endTime).toBe(secondEndTime)
    })

    it('終業時間が始業時間より前の場合、エラーを投げる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')
      const shiftType = ShiftType.create('早番', startTime, endTime)

      const newStartTime = new ShiftTypeTime('17:00')
      const newEndTime = new ShiftTypeTime('09:00')

      expect(() => {
        shiftType.updateTime(newStartTime, newEndTime)
      }).toThrow(EndTimeMustBeAfterStartTimeError)
    })

    it('終業時間が始業時間と同じ場合、エラーを投げる', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')
      const shiftType = ShiftType.create('早番', startTime, endTime)

      const newStartTime = new ShiftTypeTime('09:00')
      const newEndTime = new ShiftTypeTime('09:00')

      expect(() => {
        shiftType.updateTime(newStartTime, newEndTime)
      }).toThrow(EndTimeMustBeAfterStartTimeError)
    })

    it('時間を更新しても名前は変更されない', () => {
      const startTime = new ShiftTypeTime('09:00')
      const endTime = new ShiftTypeTime('17:00')
      const shiftType = ShiftType.create('早番', startTime, endTime)

      const newStartTime = new ShiftTypeTime('10:00')
      const newEndTime = new ShiftTypeTime('18:00')
      shiftType.updateTime(newStartTime, newEndTime)

      expect(shiftType.name).toBe('早番')
    })
  })
})
