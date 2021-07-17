import TodoInput from './TodoInput.js';
import TodoList from './TodoList.js';
import Buttons from './Buttons.js';

export default class App {
  constructor(el) {
    this.el = el;
  }

  components = {
    'todo-input': TodoInput,
    'todo-list': TodoList,
    'buttons': Buttons,
  };

  getNow() {
    return new Date()
    .toLocaleDateString('ko-KR', { month: 'long', day: '2-digit', weekday: 'long'});
  }

  template = () => `
    <header class="header">${ this.getNow() }</header>
    <todo-input></todo-input>
    <todo-list></todo-list>
    <buttons></buttons>
    <footer class="footer">made with flux pattern</footer>
  `

  appendComponents(root) {
    for (let key in this.components) {
      const el = root.querySelector(key);
      (new this.components[key](el)).render();
    }
  }

  render() {
    const root = document.createElement('div');
    root.className = 'app';
    root.innerHTML = this.template();

    this.appendComponents(root);    

    this.el.replaceWith(root);
    this.el = root;
  }
}

