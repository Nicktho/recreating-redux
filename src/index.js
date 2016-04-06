export function createStore(reducer, initialState) {
  let listeners = [];
  let currentState = initialState;

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    listeners.push(listener);
  }

  function dispatch(action) {
    currentState = reducer(currentState, action);

    listeners.forEach(listener => listener());
  }

  dispatch({ type: 'INIT' });

  return { getState, subscribe, dispatch };
}


export function combineReducers(reducers) {
  return (oldState, action) => {
    return Object.keys(reducers).reduce((newState, key) => {
      const reducer = reducers[key];

      newState[key] = reducer(oldState[key], action);

      return newState;
    }, {});
  }
}
