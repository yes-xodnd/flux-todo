import todoStore from "../stores/todo.js";
import { dispatch } from '../flux.js';
import { clearTodo, clearTodoDone } from '../actions.js';

export default class Buttons {
  constructor(el) {
    this.el = el;
    todoStore.subscribe(this);
  }
  
  template = `
    <button class="button button-clear-done">완료 삭제</button>
    <button class="button button-clear">전체 삭제</button>
  `

  render() {
    const itemCount = todoStore.getState().todos.length;
    const root = document.createElement('div');
    root.className = 'buttons';

    if (itemCount) {
      root.innerHTML = this.template;
      root
        .querySelector('.button-clear-done')
        .addEventListener('click', () => dispatch(clearTodoDone()));
      root
      .querySelector('.button-clear')
      .addEventListener('click', () => dispatch(clearTodo()));
    }
    
    this.el.replaceWith(root);
    this.el = root;
  }
}