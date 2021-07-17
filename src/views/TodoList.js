import mainStore from '../stores/main.js';
import { deleteTodo, toggleTodoDone } from '../actions.js'; 

const TodoItem = item => `
  <div class="todo-item">
    <div
      class="checkbox ${item.done ? 'checkbox-active' : ''}"
      data-todo-id=${item.id}>
    </div>
    <p ${ item.done ? 'class="todo-item-disabled"' : ''}>${item.content}</p>
    <button class="button" data-todo-id=${item.id}>X</button>
  </div>
`;

export default class TodoList {
  constructor(el) {
    this.el = el;
    mainStore.subscribe(this);
  }

  template(todos) {
    return todos.map(item => TodoItem(item)).join('');
  }

  render() {
    const { todos } = mainStore.getState();
    const root = document.createElement('div');
    root.className = 'todo-list';
    root.innerHTML = this.template(todos);

    root.addEventListener('click', e => {
      const classList = Array.from(e.target.classList);

      if (classList.includes('button')) {
        deleteTodo(e.target.dataset.todoId);

      } else if (classList.includes('checkbox')) {
        toggleTodoDone(e.target.dataset.todoId);
      }

    });

    this.el.replaceWith(root);
    this.el = root;
  }
}