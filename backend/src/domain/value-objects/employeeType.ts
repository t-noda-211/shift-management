import { ValueObjectError } from './valueObjectError'
import type { ValueObject } from './valueObject'

/**
 * 従業員種別の表示名の型
 */
export type EmployeeTypeName = '社員' | '派遣'

/**
 * 従業員種別のコードの型
 */
export type EmployeeTypeCode = 'REGULAR' | 'DISPATCHED'

export class InvalidEmployeeTypeError extends ValueObjectError {
  constructor() {
    super('Employee Type code must be either "REGULAR" or "DISPATCHED"')
  }
}

/**
 * 従業員種別の値オブジェクト
 * 社員または派遣のいずれかを表す
 */
export class EmployeeType implements ValueObject {
  readonly code: EmployeeTypeCode
  readonly name: EmployeeTypeName

  private static readonly CODE_TO_VALUE: Record<
    EmployeeTypeCode,
    EmployeeTypeName
  > = {
    REGULAR: '社員',
    DISPATCHED: '派遣',
  } as const

  private static readonly VALID_CODES = ['REGULAR', 'DISPATCHED'] as const

  private constructor(code: EmployeeTypeCode) {
    this.code = code
    this.name = EmployeeType.CODE_TO_VALUE[code]
  }

  /**
   * コード（大文字英数字）からインスタンスを生成
   * @param code 従業員種別のコード（"REGULAR" または "DISPATCHED"）
   * @returns EmployeeType インスタンス
   * @throws InvalidEmployeeTypeError 無効なコードが指定された場合
   */
  static from(code: string): EmployeeType {
    if (!EmployeeType.VALID_CODES.includes(code as EmployeeTypeCode)) {
      throw new InvalidEmployeeTypeError()
    }
    return new EmployeeType(code as EmployeeTypeCode)
  }

  /**
   * 社員のインスタンスを作成
   */
  static regular(): EmployeeType {
    return new EmployeeType('REGULAR')
  }

  /**
   * 派遣のインスタンスを作成
   */
  static dispatched(): EmployeeType {
    return new EmployeeType('DISPATCHED')
  }

  /**
   * 社員かどうかを判定
   */
  isRegular(): boolean {
    return this.code === 'REGULAR'
  }

  /**
   * 派遣かどうかを判定
   */
  isDispatched(): boolean {
    return this.code === 'DISPATCHED'
  }

  equals(other: EmployeeType): boolean {
    if (this === other) {
      return true
    }

    return this.code === other.code && this.name === other.name
  }
}
