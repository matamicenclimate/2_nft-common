export interface EncodeResult {
  payload: Uint8Array
}

export interface EncodeParameters {
  object: object
}

/**
 * Takes an object, serializes it into a binary format.
 */
export interface EncodeFeature {
  encodeObject(params: EncodeParameters): Promise<EncodeResult>
}
