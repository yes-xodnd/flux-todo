import { dispatcher } from './flux.js';
const dispatch = dispatcher.dispatch;


export const addTodo = content => dispatch({
  type: 'ADD_TODO',
  data: {
    todoItem: {
      id: '' + Date.now(),
      done: false,
      content
    }
  }   
});

export const deleteTodo = id => dispatch({
  type: 'DELETE_TODO',
  data: { id }
});

export const toggleTodoDone = id => dispatch({
  type: 'TOGGLE_TODO_DONE',
  data: { id }
});

export const clearTodo = () => dispatch({
  type: 'CLEAR_TODO',
});

export const clearTodoDone = () => dispatch({
  type: 'CLEAR_TODO_DONE',
});