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
      addTodo(input.value);
      input.value = '';
    }

    input.addEventListener('keyup', e => {
      const { key } = e;
      if (key === 'Enter') {
        handleEvent();
      }
    });

    button.addEventListener('click', handleEvent);

    this.el.replaceWith(root);
    this.el = root;
  }
}