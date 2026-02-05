import { ShiftNoticeContent } from '@/domain/value-objects/shiftNoticeContent'
import { InvalidShiftNoticeContentError } from '@/domain/value-objects/shiftNoticeContent'
import { ShiftNoticeId } from '@/domain/value-objects/shiftNoticeId'
import { ShiftNoticeTitle } from '@/domain/value-objects/shiftNoticeTitle'
import { InvalidShiftNoticeTitleError } from '@/domain/value-objects/shiftNoticeTitle'
import { ShiftScheduleId } from '@/domain/value-objects/shiftScheduleId'

import { ShiftNotice } from './shiftNotice'

describe('ShiftNotice', () => {
  const shiftScheduleId = ShiftScheduleId.create()

  describe('create', () => {
    it('正常なShiftNoticeを作成できる', () => {
      const notice = ShiftNotice.create(
        shiftScheduleId,
        '来月のシフトについて',
        '来月のシフト希望は25日までに提出してください。'
      )

      expect(notice.id).toBeInstanceOf(ShiftNoticeId)
      expect(notice.shiftScheduleId).toBe(shiftScheduleId)
      expect(notice.title).toBe('来月のシフトについて')
      expect(notice.content).toBe(
        '来月のシフト希望は25日までに提出してください。'
      )
    })

    it('毎回新しいIDが生成される', () => {
      const notice1 = ShiftNotice.create(shiftScheduleId, 'タイトル1', '内容1')
      const notice2 = ShiftNotice.create(shiftScheduleId, 'タイトル2', '内容2')

      expect(notice1.id.value).not.toBe(notice2.id.value)
    })

    it('最小長のタイトルと内容で作成できる', () => {
      const notice = ShiftNotice.create(shiftScheduleId, '早', '早')

      expect(notice.title).toBe('早')
      expect(notice.content).toBe('早')
    })

    it('最大長のタイトルと内容で作成できる', () => {
      const maxTitle = 'あ'.repeat(50)
      const maxContent = 'あ'.repeat(500)
      const notice = ShiftNotice.create(shiftScheduleId, maxTitle, maxContent)

      expect(notice.title).toBe(maxTitle)
      expect(notice.content).toBe(maxContent)
    })

    it('空文字列のタイトルの場合、エラーを投げる', () => {
      expect(() => {
        ShiftNotice.create(shiftScheduleId, '', '内容')
      }).toThrow(InvalidShiftNoticeTitleError)
    })

    it('最大長を超えるタイトルの場合、エラーを投げる', () => {
      const tooLongTitle = 'あ'.repeat(51)

      expect(() => {
        ShiftNotice.create(shiftScheduleId, tooLongTitle, '内容')
      }).toThrow(InvalidShiftNoticeTitleError)
    })

    it('空文字列の内容の場合、エラーを投げる', () => {
      expect(() => {
        ShiftNotice.create(shiftScheduleId, 'タイトル', '')
      }).toThrow(InvalidShiftNoticeContentError)
    })

    it('最大長を超える内容の場合、エラーを投げる', () => {
      const tooLongContent = 'あ'.repeat(501)

      expect(() => {
        ShiftNotice.create(shiftScheduleId, 'タイトル', tooLongContent)
      }).toThrow(InvalidShiftNoticeContentError)
    })
  })

  describe('from', () => {
    it('既存の値からShiftNoticeを再構築できる', () => {
      const id = ShiftNoticeId.create()
      const title = new ShiftNoticeTitle('既存のタイトル')
      const content = new ShiftNoticeContent('既存の内容')

      const notice = ShiftNotice.from(id, shiftScheduleId, title, content)

      expect(notice.id).toBe(id)
      expect(notice.shiftScheduleId).toBe(shiftScheduleId)
      expect(notice.title).toBe('既存のタイトル')
      expect(notice.content).toBe('既存の内容')
    })
  })

  describe('title getter', () => {
    it('タイトルを取得できる', () => {
      const notice = ShiftNotice.create(shiftScheduleId, 'タイトル', '内容')

      expect(notice.title).toBe('タイトル')
    })
  })

  describe('content getter', () => {
    it('内容を取得できる', () => {
      const notice = ShiftNotice.create(shiftScheduleId, 'タイトル', '内容')

      expect(notice.content).toBe('内容')
    })
  })

  describe('updateTitle', () => {
    it('タイトルを更新できる', () => {
      const notice = ShiftNotice.create(shiftScheduleId, '元のタイトル', '内容')

      notice.updateTitle('新しいタイトル')

      expect(notice.title).toBe('新しいタイトル')
      expect(notice.content).toBe('内容')
    })

    it('空文字列のタイトルで更新しようとした場合、エラーを投げる', () => {
      const notice = ShiftNotice.create(shiftScheduleId, '元のタイトル', '内容')

      expect(() => {
        notice.updateTitle('')
      }).toThrow(InvalidShiftNoticeTitleError)

      expect(notice.title).toBe('元のタイトル')
    })

    it('最大長を超えるタイトルで更新しようとした場合、エラーを投げる', () => {
      const notice = ShiftNotice.create(shiftScheduleId, '元のタイトル', '内容')
      const tooLongTitle = 'あ'.repeat(51)

      expect(() => {
        notice.updateTitle(tooLongTitle)
      }).toThrow(InvalidShiftNoticeTitleError)

      expect(notice.title).toBe('元のタイトル')
    })
  })

  describe('updateContent', () => {
    it('内容を更新できる', () => {
      const notice = ShiftNotice.create(shiftScheduleId, 'タイトル', '元の内容')

      notice.updateContent('新しい内容')

      expect(notice.title).toBe('タイトル')
      expect(notice.content).toBe('新しい内容')
    })

    it('空文字列の内容で更新しようとした場合、エラーを投げる', () => {
      const notice = ShiftNotice.create(shiftScheduleId, 'タイトル', '元の内容')

      expect(() => {
        notice.updateContent('')
      }).toThrow(InvalidShiftNoticeContentError)

      expect(notice.content).toBe('元の内容')
    })

    it('最大長を超える内容で更新しようとした場合、エラーを投げる', () => {
      const notice = ShiftNotice.create(shiftScheduleId, 'タイトル', '元の内容')
      const tooLongContent = 'あ'.repeat(501)

      expect(() => {
        notice.updateContent(tooLongContent)
      }).toThrow(InvalidShiftNoticeContentError)

      expect(notice.content).toBe('元の内容')
    })
  })
})
