export default function stateReducer(state, newState) {
  return { ...state, ...newState };
}
