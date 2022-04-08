/*
  Application utility functions.
*/

export type Entry = {
  key: string
  value: { bytes: string; type: 1 | 2; uint: number }
}

export type Dict = Record<string, number | Uint8Array>

/**
 * Parses the entries record list, as a record.
 */
export function parseEntries(params: Entry[]): Dict {
  return params.reduce<Dict>((prev, curr: Entry) => {
    const key = Buffer.from(curr.key, 'base64').toString()
    if (curr.value.type === 1) {
      prev[key] = Buffer.from(curr.value.bytes, 'base64')
    } else if (curr.value.type === 2) {
      prev[key] = curr.value.uint
    }
    return prev
  }, {})
}
