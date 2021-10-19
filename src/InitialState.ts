/**
 * Class describing the initial state of the DID.
 */
export default class InitialState {
   /**
    * Constructs a new instance on the @see CurrentState class.
    * @param shortForm hash-based version of the DID URI string (only resolvable when anchored).
    * @param longForm fully self-resolving payload-embedded version of the DID URI string.
    * @param ops array of all operations that have been included in the state chain of the DID.
    */
  constructor (public readonly shortForm: string, public readonly longForm: string, public readonly ops: [any]) {
  }
}
