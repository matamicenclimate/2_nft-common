import { Dict } from '@common/src/lib/app'
import { UnsignedOperation } from '../Operation'

export default interface OperationFeature {
  /**
   * Create a new unsigned operation from strand.
   */
  operation(id: string, data?: Dict): UnsignedOperation
}
