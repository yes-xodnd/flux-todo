import { createStore, dispatcher } from '../flux.js';

const mainStore = createStore({
  todos: [],
});

mainStore
.addReducer('ADD_TODO', (state, action) => {
  const { todoItem } = action.data;
  state.todos = [ todoItem, ...state.todos ];
  return state;
})
.addReducer('DELETE_TODO', (state, action) => {
  const { id } = action.data;
  state.todos = state.todos.filter(item => item.id !== id);
  return state;
})
.addReducer('TOGGLE_TODO_DONE', (state, action) => {
  const { id } = action.data;
  const index = state.todos.findIndex(item => item.id === id);
  state.todos[index].done = !state.todos[index].done;
  return state;
})
.addReducer('CLEAR_TODO', (state) => {
  state.todos = [];
  return state;
})
.addReducer('CLEAR_TODO_DONE', (state) => {
  state.todos = state.todos.filter(item => !item.done);
  return state;
})
;

dispatcher.register(mainStore);

export default mainStore;