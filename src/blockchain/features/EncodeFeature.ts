export interface EncodeResult {
  payload: Uint8Array
}

export interface EncodeParameters {
  object: object
}

export interface EncodeFeature {
  /**
   * Takes an object, serializes it into a binary format.
   */
  encodeObject(params: EncodeParameters): Promise<EncodeResult>
}
