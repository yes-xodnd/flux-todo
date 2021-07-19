# Flux-todo
Flux패턴을 공부하고, 해당 패턴을 이용하여 todo 리스트를 구현해보았습니다.
[여기](https://yes-xodnd.github.io/flux-todo)에서 데모를 실행해볼 수 있습니다.

![image-20210718044530092](README.assets/image-20210718044530092.png)



## 파일 구조

```
src/
├ stores/
├ views/
├ action.js
└ flux.js
```

주요 파일구조는 위와 같습니다. Flux 패턴의 네 가지 요소인 디스패처, 스토어, 액션, 뷰에 해당하는 파일 또는 폴더를 생성했습니다. 여러 개의 파일이 있을 수 있는 요소는 폴더로 생성했습니다. `flux.js` 파일에는 디스패처와 스토어 생성 함수를 합쳐 관리하도록 하였습니다.



## Flux 요소 구현 내용

### 디스패처 Dispatcher

- `register` 메소드로 스토어는 디스패처에 등록할 수 있습니다.
- `dispatch` 메소드로 등록된 스토어에 액션을 전달할 수 있습니다.
- 클로저로 구현하여 스토어 목록에 직접 접근하거나 수정할 수 없습니다.
- 즉시실행함수로 애플리케이션 당 하나의 디스패처만 존재할 수 있게 합니다.
- `dispatch` 함수만 외부에서 사용할 수 있도록 export 합니다.

``` js
// src/flux.js
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
```



### 스토어 Stores

- `initState`와 `reducer`를 전달하여 스토어를 생성할 수 있습니다.
- 클로저로 구현하여 스토어의 `state` 객체에는 외부에서 직접 접근하거나 수정할 수 없습니다.
  getter로 `getState` 메소드를 제공하며, 항상 사본을 반환합니다.
- `subscribe` 메소드를 통해 컴포넌트들은 스토어 `state`의 변경을 구독할 수 있습니다.
  변경이 있을 때 구독한 컴포넌트들은 리렌더링 됩니다.
- `dispatch` 메소드를 통해 외부(디스패처)에서 액션을 전달받고, `reducer` 를 통해 `state`를 새로운 값으로 변경할 수 있습니다.
- 스토어를 생성하면 디스패처에 자동으로 등록됩니다.

``` js
// src/flux.js
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
  // 스토어를 디스패처에 등록합니다.
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
```

- 스토어 생성 예시는 다음과 같습니다.

``` js
// src/stores/todo.js
import { createStore } from '../flux.js';

const initState = {
  todos: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      state.todos = [ action.data.todoItem, ...state.todos ];
      return state;

    case 'DELETE_TODO':
      state.todos = state.todos.filter(item => item.id !== action.data.id);
      return state;
      
		// ...
    
    default:
      return state;
  }
}

const todoStore = createStore(initState, reducer);

export default todoStore;
```



### 액션 Actions

- 액션 생성 함수를 정의합니다.
- 액션은 `type`과 `data` 프로퍼티를 갖는 단순한 객체입니다.

``` js
// src/actions.js
import { dispatcher } from './flux.js';
const dispatch = dispatcher.dispatch;

export const addTodo = content => ({
  type: 'ADD_TODO',
  data: {
    todoItem: {
      id: '' + Date.now(),
      done: false,
      content
    }
  }   
});

export const clearTodo = () => ({
  type: 'CLEAR_TODO',
});
```



### 뷰 Views

- 뷰는 클래스를 이용해 컴포넌트로 구현했습니다.
- 생성될 때 `HTMLElement`인 `el`을 전달받아 저장합니다.
- `render` 메소드는 새로운 DOM 트리를 생성하고 `el`과 교체하여 업데이트합니다.
  `template`은 문자열 또는 문자열을 반환하는 함수로, `innerHTML`을 통해 새로운 DOM 트리에 삽입됩니다.
- 새로운 DOM 트리의 요소를 선택해 앞에서 정의한 액션 함수를 이벤트리스너로 등록할 수 있습니다.

``` js
import { dispatch } from '../flux.js';
import { addTodo } from '../actions.js';

export default class TodoInput {
  constructor(el) {
    this.el = el;
  }

  template = `
    <button class="button">+</button>
    <input type="text" value="" placeholder="여기에 할 일을 입력하세요."/>
  `;

  render() {
    const root = document.createElement('div');
    root.className = 'todo-input';
    root.innerHTML = this.template;

    const input = root.querySelector('input');
    const button = root.querySelector('button');

    function handleEvent() {
      if (!input.value) {
        alert('내용을 입력해주세요!');
        return ;
      }
      dispatch(addTodo(input.value));
      input.value = '';
    }

    button.addEventListener('click', handleEvent);

    this.el.replaceWith(root);
    this.el = root;
  }
}
```

