import { expect } from 'chai';
import { createStore, combineReducers } from '../src/index';

describe('createStore', () => {
  describe('#getState', () => {
    it('should return the current state', () => {
      const state = { notes: [ 'hello world', 'hello' ] };

      const store = createStore(x => x, state);

      expect(store.getState()).to.equal(state);
    });
  });

  describe('#subscribe', () => {
    it('should add the passed function to the listeners', () => {
      const store = createStore(x => x, {});

      let called = false;

      store.subscribe(() => called = true);
      store.dispatch({ type: '' });

      expect(called).to.be.true;
    });
  });

  describe('#dispatch', () => {
    const reducer = (state = [ 'hello world' ], action) => {
      switch(action.type) {
        case 'ADD_NOTE':
          return [ ...state, action.payload ];
        default:
          return state;
      }
    };

    const addNote = payload => ({ type: 'ADD_NOTE', payload });

    it('should update the state with the result of the reducer', () => {
      const store = createStore(reducer);

      store.dispatch(addNote('hello'));

      expect(store.getState()).to.deep.equal([ 'hello world', 'hello' ]);
    });

    it('should call all listeners', () => {
      const store = createStore(reducer);

      let called = false;

      store.subscribe(() => called = true);
      store.dispatch(addNote());

      expect(called).to.be.true;
    });
  });
});

describe('combineReducers', () => {
  it('should combine multiple reducers to a single reducer', () => {
    const notes = (state = [ 'hello world' ], action) => {
      switch(action.type) {
        case 'ADD_NOTE':
          return [ ...state, action.payload ];
        default:
          return state;
      }
    };

    const numbers = (state = [ 1 ], action) => {
      switch(action.type) {
        case 'ADD_NUMBER':
          return [ ...state, action.payload ];
        default:
          return state;
      }
    };

    const reducer = combineReducers({ notes, numbers });

    const state = reducer({}, { type: 'ADD_NUMBER', payload: 2 });

    expect(state).to.deep.equal({
      notes: [ 'hello world' ],
      numbers: [ 1, 2 ]
    });
  });
});
