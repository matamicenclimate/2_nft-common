function cast<T>(typeChecker: (a: unknown) => a is T) {
  return function (value: unknown): T {
    if (typeChecker(value)) return value
    throw new Error(
      `Dynamic cast exception: Input value did not match the built check type.`
    )
  }
}

function Str(t: unknown): t is string {
  return typeof t === 'string'
}

function Numeric(t: unknown): t is number {
  return typeof t === 'number'
}

function Int(t: unknown): t is number {
  return Numeric(t) && Number.isInteger(t)
}

function Vector<T = unknown>(t: unknown): t is Array<T> {
  return t instanceof Array
}

function of<T extends { new (...args: any[]): unknown }>(tt: T) {
  return function (t: unknown): t is InstanceType<T> {
    return t instanceof tt
  }
}

export {
  cast,
  Vector as array,
  Numeric as number,
  Str as string,
  Int as int,
  of,
}
