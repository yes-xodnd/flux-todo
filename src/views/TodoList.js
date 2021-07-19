import todoStore from '../stores/todo.js';
import { deleteTodo, toggleTodoDone } from '../actions.js'; 
import { dispatch } from '../flux.js';

const TodoItem = item => `
  <div class="todo-item">
    <div class="checkbox">
      <input
        type="checkbox"
        ${item.done ? 'checked' : ''} 
        value=${item.id}>
      </input>
    </div>
    <p ${ item.done ? 'class="text-disabled"' : ''}>${item.content}</p>
    <button class="button" data-todo-id=${item.id}>X</button>
  </div>
`;

export default class TodoList {
  constructor(el) {
    this.el = el;
    todoStore.subscribe(this);
  }

  template(todos) {
    return todos.map(item => TodoItem(item)).join('');
  }

  render() {
    const { todos } = todoStore.getState();
    const root = document.createElement('div');
    root.className = 'todo-list';
    root.innerHTML = this.template(todos);

    root.addEventListener('click', e => {
      const { tagName } = e.target;

      if (tagName === 'INPUT') {
        dispatch(toggleTodoDone(e.target.value));
        return;
      }

      if (tagName === 'BUTTON') {
        dispatch(deleteTodo(e.target.dataset.todoId));
        return;
      }
    });

    this.el.replaceWith(root);
    this.el = root;
  }
}