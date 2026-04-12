import { AppDateTime } from '@/domain/valueObjects/appDateTime'
import { jest } from '@jest/globals'

const mockAppDateTimeNowSpy = jest.spyOn(AppDateTime, 'now')

export const mockNowAppDateTime = AppDateTime.from(2026, 6, 15, 12, 0, 0)
export const mockFutureAppDateTime = AppDateTime.from(2027, 6, 15, 12, 0, 0)
export const mockUpdatedAtFutureAppDateTime = AppDateTime.from(
  2026,
  6,
  15,
  20,
  0,
  0
)

export const mockNow = (): void => {
  mockAppDateTimeNowSpy.mockImplementation(() => mockNowAppDateTime)
}

// 現在日時を未来にする
export const makeFuture = (): void => {
  mockAppDateTimeNowSpy.mockImplementation(() => mockFutureAppDateTime)
}

// 更新日時を未来にする
export const makeUpdatedAtFuture = (): void => {
  mockAppDateTimeNowSpy.mockImplementation(() => mockUpdatedAtFutureAppDateTime)
}
