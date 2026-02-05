import { AppDateTime } from 'shared/appDateTime'

export type ShiftAssignmentHistoryEmployee = {
  id: string // 従業員は現在の情報と紐づけたい可能性があるためidを持っておく
  fullName: string
  typeCode: string
  typeName: string
}

export type ShiftAssignmentHistoryShiftType = {
  name: string
  startTime: string // "HH:mm"
  endTime: string // "HH:mm"
}

export type ShiftAssignmentHistoryTimeOffType = {
  code: string
  name: string
}

export type ShiftAssignmentHistory = {
  date: string // "YYYY-MM-DD"
  employee: ShiftAssignmentHistoryEmployee
  shiftType: ShiftAssignmentHistoryShiftType
  customStartTime: string | null // "HH:mm"
  customEndTime: string | null // "HH:mm"
  timeOffType: ShiftAssignmentHistoryTimeOffType | null
}

export type ShiftNoticeHistory = {
  title: string
  content: string
}

export type ShiftScheduleHistory = {
  year: number
  month: number
  shiftAssignments: ShiftAssignmentHistory[]
  shiftNotices: ShiftNoticeHistory[]
  createdAt: AppDateTime
  updatedAt: AppDateTime
}
