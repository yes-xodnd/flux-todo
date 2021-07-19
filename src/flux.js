const deepClone = obj => JSON.parse(JSON.stringify(obj));

const dispatcher = (() => {
  const stores = [];
  const dispatcher = {
    register(store) {
      stores.push(store);
      return store;
    },
    dispatch(action) {
      stores.forEach(store => store.dispatch(action));
    }
  };

  return Object.freeze(dispatcher);
})();

export const createStore = (initState, reducer = () => {}) => {
  let state = initState;
  const subscribers = [];
  const emit = () => subscribers
    .forEach(component => component.render());

  const store = {
    getState() {
      return deepClone(state);
    },
    subscribe(component) {
      subscribers.push(component);
    },
    dispatch(action) {
      state = reducer(state, action);
      emit();
    }
  };

  return Object.freeze(dispatcher.register(store));
}

export const dispatch = dispatcher.dispatch;

