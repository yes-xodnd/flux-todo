const deepClone = obj => JSON.parse(JSON.stringify(obj));

const dispatcher = (() => {
  const stores = [];
  const dispatcher = {
    /**
     * 디스패처에 스토어를 등록합니다.
     * 스토어의 dispatch 함수를 인자로 받습니다.
     * @param {Function} dispatchStore 
     */
    register(dispatchStore) {
      stores.push(dispatchStore);
    },
    /**
     * 등록된 스토어에 액션을 디스패치합니다.
     * 액션 객체를 인자로 받습니다.
     * @param {Object} action 
     */
    dispatch(action) {
      stores.forEach(dispatchStore => dispatchStore(action));
    }
  };

  return dispatcher;
})();

export const { dispatch } = dispatcher;

/**
 * 초기화 상태와 리듀서 함수를 받아 스토어를 생성합니다.
 * @param {*} initState
 * @param {Function} reducer 
 * @returns 
 */
export const createStore = (initState, reducer = () => {}) => {
  let state = initState;
  const subscribers = [];

  /**
   * 액션 객체를 전달받고, 리듀서로 상태를 업데이트합니다.
   * 스토어를 구독하는 컴포넌트를 리렌더링 합니다.
   * @param {Object} action 
   */
  const dispatch = action => {
    state = reducer(state, action);
    subscribers.forEach(component => component.render());
  }
  dispatcher.register(dispatch);

  const store = {
    /**
     * state의 사본을 반환합니다.
     * @returns state
     */
    getState() {
      return deepClone(state);
    },
    /**
     * 스토어에 컴포넌트를 등록합니다.
     * 등록한 컴포넌트는 스토어가 업데이트할 때마다 리렌더링합니다.
     * @param {*} component 
     */
    subscribe(component) {
      subscribers.push(component);
    },
  };

  return Object.freeze(store);
}

