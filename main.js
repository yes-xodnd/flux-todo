import App from './src/views/App.js';

(function renderRoot(selector) {
  const el = document.querySelector(selector);
  const app = new App(el);
  app.render();
})('.app');