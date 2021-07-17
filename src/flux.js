const deepClone = obj => JSON.parse(JSON.stringify(obj));

export const createStore = initState => {
  let state = initState;
  const subscribers = [];
  const reducers = {};
  const emit = () => subscribers.forEach(component => component.render());

  const store = {
    getState() {
      return deepClone(state);
    },
    subscribe(component) {
      subscribers.push(component);
    },
    addReducer(type, reducer) {
      if (reducers[type]) {
        throw new Error(`이미 등록된 Action type입니다. type: ${type}`);
      }

      reducers[type] = reducer;
      return this;
    },
    dispatch(action) {
      if (!reducers[action.type]) {
        return ;
      }

      const reducer = reducers[action.type];
      const newState = reducer(deepClone(state), action);
      state = newState;
      emit();
    }
  };

  return Object.freeze(store);
}

const createDispatcher = () => {
  const stores = [];
  const dispatcher = {
    register(store) {
      stores.push(store)
    },
    dispatch(action) {
      stores.forEach(store => store.dispatch(action));
    }
  };

  return Object.freeze(dispatcher);
}

export const dispatcher = createDispatcher();

