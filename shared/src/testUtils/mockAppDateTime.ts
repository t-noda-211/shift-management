import { AppDateTime } from '../appDateTime'

let mockNowAppDateTime: AppDateTime | null = null

jest.mock('shared/appDateTime', () => {
  const actual =
    jest.requireActual<typeof import('shared/appDateTime')>(
      'shared/appDateTime'
    )
  return {
    ...actual,
    AppDateTime: {
      ...actual.AppDateTime,
      now: () => mockNowAppDateTime ?? actual.AppDateTime.now(),
      from: actual.AppDateTime.from,
    },
  }
})

/**
 * モックの現在日時を設定する
 * @param appDateTime - AppDateTime
 */
export function setMockNow(appDateTime: AppDateTime): void {
  mockNowAppDateTime = AppDateTime.from(
    appDateTime.year,
    appDateTime.month,
    appDateTime.day,
    appDateTime.hour,
    appDateTime.minute,
    appDateTime.second
  )
}
