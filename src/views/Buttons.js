import mainStore from "../stores/main.js";
import { clearTodo, clearTodoDone } from '../actions.js';

export default class Buttons {
  constructor(el) {
    this.el = el;
    mainStore.subscribe(this);
  }
  
  template = `
    <button class="button button-clear-done">완료 삭제</button>
    <button class="button button-clear">전체 삭제</button>
  `

  render() {
    const itemCount = mainStore.getState().todos.length;
    const root = document.createElement('div');
    root.className = 'buttons';

    if (itemCount) {
      root.innerHTML = this.template;
      root.querySelector('.button-clear-done').addEventListener('click', clearTodoDone);
      root.querySelector('.button-clear').addEventListener('click', clearTodo);
    }
    
    this.el.replaceWith(root);
    this.el = root;
  }
}