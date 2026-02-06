/**
 * 値オブジェクトの共通インターフェース
 */
export interface ValueObject {
  /**
   * 他の値オブジェクトと等価かどうかを判定する
   * @param other 比較対象の値オブジェクト
   * @returns 等価な場合true、そうでない場合false
   */
  equals(other: ValueObject): boolean
}
