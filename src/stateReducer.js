/**
 * Shallowly merge newState into state
 */
export function stateReducer(state, newState) {
  return { ...state, ...newState };
}
