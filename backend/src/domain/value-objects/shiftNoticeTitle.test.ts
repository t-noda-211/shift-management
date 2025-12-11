import {
  ShiftNoticeTitle,
  InvalidShiftNoticeTitleError,
} from './shiftNoticeTitle'

describe('ShiftNoticeTitle', () => {
  describe('constructor', () => {
    it('正常なタイトルを作成できる', () => {
      const title = new ShiftNoticeTitle('来月のシフトについて')

      expect(title.value).toBe('来月のシフトについて')
    })

    it('最小長（1文字）のタイトルを作成できる', () => {
      const title = new ShiftNoticeTitle('早')

      expect(title.value).toBe('早')
    })

    it('最大長（50文字）のタイトルを作成できる', () => {
      const longTitle = 'あ'.repeat(50)
      const title = new ShiftNoticeTitle(longTitle)

      expect(title.value).toBe(longTitle)
    })

    it('空文字列の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftNoticeTitle('')
      }).toThrow(InvalidShiftNoticeTitleError)
    })

    it('最大長を超える場合、エラーを投げる', () => {
      const tooLongTitle = 'あ'.repeat(51)

      expect(() => {
        new ShiftNoticeTitle(tooLongTitle)
      }).toThrow(InvalidShiftNoticeTitleError)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const title = new ShiftNoticeTitle('来月のシフトについて')

      expect(title.equals(title)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const title1 = new ShiftNoticeTitle('来月のシフトについて')
      const title2 = new ShiftNoticeTitle('来月のシフトについて')

      expect(title1.equals(title2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const title1 = new ShiftNoticeTitle('来月のシフトについて')
      const title2 = new ShiftNoticeTitle('今月のシフトについて')

      expect(title1.equals(title2)).toBe(false)
    })
  })
})
