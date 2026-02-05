import { ShiftNoticeContent } from '@/domain/value-objects/shiftNoticeContent'
import { ShiftNoticeId } from '@/domain/value-objects/shiftNoticeId'
import { ShiftNoticeTitle } from '@/domain/value-objects/shiftNoticeTitle'
import { ShiftScheduleId } from '@/domain/value-objects/shiftScheduleId'

/**
 * ShiftNotice エンティティ
 * 従業員への事務連絡を表す
 * ShiftSchedule集約に属する
 */
export class ShiftNotice {
  private constructor(
    public readonly id: ShiftNoticeId,
    public readonly shiftScheduleId: ShiftScheduleId,
    private _title: ShiftNoticeTitle,
    private _content: ShiftNoticeContent
  ) {}

  get title(): string {
    return this._title.value
  }

  get content(): string {
    return this._content.value
  }

  static create(
    shiftScheduleId: ShiftScheduleId,
    title: string,
    content: string
  ): ShiftNotice {
    const id = ShiftNoticeId.create()
    return new ShiftNotice(
      id,
      shiftScheduleId,
      new ShiftNoticeTitle(title),
      new ShiftNoticeContent(content)
    )
  }

  static from(
    id: ShiftNoticeId,
    shiftScheduleId: ShiftScheduleId,
    title: ShiftNoticeTitle,
    content: ShiftNoticeContent
  ): ShiftNotice {
    return new ShiftNotice(id, shiftScheduleId, title, content)
  }

  updateTitle(title: string): void {
    this._title = new ShiftNoticeTitle(title)
  }

  updateContent(content: string): void {
    this._content = new ShiftNoticeContent(content)
  }
}
