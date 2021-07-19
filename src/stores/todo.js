import { createStore } from '../flux.js';
import { 
  ADD_TODO,
  DELETE_TODO,
  TOGGLE_TODO_DONE,
  CLEAR_TODO,
  CLEAR_TODO_DONE
} from '../actionTypes.js';

const initState = {
  todos: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_TODO:
      state.todos = [ action.data.todoItem, ...state.todos ];
      return state;

    case DELETE_TODO:
      state.todos = state.todos.filter(item => item.id !== action.data.id);
      return state;
    
    case TOGGLE_TODO_DONE:
      {
        const index = state.todos.findIndex(item => item.id === action.data.id);
        state.todos[index].done = !state.todos[index].done;
      }
      return state;
    
    case CLEAR_TODO:
      state.todos = [];
      return state;
    
    case CLEAR_TODO_DONE:
      state.todos = state.todos.filter(item => !item.done);
      return state;  
    
    default:
      return state;
  }
}

const todoStore = createStore(initState, reducer);

export default todoStore;