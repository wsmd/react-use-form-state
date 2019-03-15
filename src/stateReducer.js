/**
 * Shallowly merge newState into state
 */
export function stateReducer(state, newState) {
  if (newState === null) {
    return {};
  }
  return { ...state, ...newState };
}
