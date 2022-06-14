export interface NodeAvailableParameters {}

export interface NodeAvailableResult {
  available: boolean
}

export interface NodeAvailableFeature {
  /**
   * Checks if the blockchain node is accessible and/or visible
   * from the current runtime.
   */
  nodeIsAvailable(params: NodeAvailableParameters): Promise<NodeAvailableResult>
}
