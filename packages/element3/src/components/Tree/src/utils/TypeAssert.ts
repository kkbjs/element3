export class TypeAssert {
  static isObject<T>(value: T): boolean {
    return value && typeof value === 'object'
  }
  static isArray<T>(value: T): boolean {
    return value instanceof Array
  }
}
