import { 
  ADD_TODO,
  DELETE_TODO,
  TOGGLE_TODO_DONE,
  CLEAR_TODO,
  CLEAR_TODO_DONE
} from './actionTypes.js';

export const addTodo = content => ({
  type: ADD_TODO,
  data: {
    todoItem: {
      id: '' + Date.now(),
      done: false,
      content
    }
  }   
});

export const deleteTodo = id => ({
  type: DELETE_TODO,
  data: { id }
});

export const toggleTodoDone = id => ({
  type: TOGGLE_TODO_DONE,
  data: { id }
});

export const clearTodo = () => ({
  type: CLEAR_TODO,
});

export const clearTodoDone = () => ({
  type: CLEAR_TODO_DONE,
});