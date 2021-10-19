/**
 * Class describing the current DID state.
 */
export default class CurrentState {
  /**
   * Constructs a new instance on the @see CurrentState class.
   * @param document representing the current state of the DID.
   * @param refreshedAt date and time for when the state was last refreshed.
   */
  constructor (public readonly document: any, public readonly refreshedAt: Date) {
  }
}
