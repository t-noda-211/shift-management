import {
  ShiftNoticeContent,
  InvalidShiftNoticeContentError,
} from './shiftNoticeContent'

describe('ShiftNoticeContent', () => {
  describe('constructor', () => {
    it('正常な内容を作成できる', () => {
      const content = new ShiftNoticeContent(
        '来月のシフト希望は25日までに提出してください。'
      )

      expect(content.value).toBe(
        '来月のシフト希望は25日までに提出してください。'
      )
    })

    it('最小長（1文字）の内容を作成できる', () => {
      const content = new ShiftNoticeContent('早')

      expect(content.value).toBe('早')
    })

    it('最大長（500文字）の内容を作成できる', () => {
      const longContent = 'あ'.repeat(500)
      const content = new ShiftNoticeContent(longContent)

      expect(content.value).toBe(longContent)
    })

    it('空文字列の場合、エラーを投げる', () => {
      expect(() => {
        new ShiftNoticeContent('')
      }).toThrow(InvalidShiftNoticeContentError)
    })

    it('最大長を超える場合、エラーを投げる', () => {
      const tooLongContent = 'あ'.repeat(501)

      expect(() => {
        new ShiftNoticeContent(tooLongContent)
      }).toThrow(InvalidShiftNoticeContentError)
    })
  })

  describe('equals', () => {
    it('同じインスタンスの場合、trueを返す', () => {
      const content = new ShiftNoticeContent(
        '来月のシフト希望は25日までに提出してください。'
      )

      expect(content.equals(content)).toBe(true)
    })

    it('同じ値を持つ別のインスタンスの場合、trueを返す', () => {
      const content1 = new ShiftNoticeContent(
        '来月のシフト希望は25日までに提出してください。'
      )
      const content2 = new ShiftNoticeContent(
        '来月のシフト希望は25日までに提出してください。'
      )

      expect(content1.equals(content2)).toBe(true)
    })

    it('異なる値を持つ場合、falseを返す', () => {
      const content1 = new ShiftNoticeContent(
        '来月のシフト希望は25日までに提出してください。'
      )
      const content2 = new ShiftNoticeContent(
        '今月のシフト希望は20日までに提出してください。'
      )

      expect(content1.equals(content2)).toBe(false)
    })
  })
})
