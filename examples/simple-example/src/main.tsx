import { render } from 'solid-js/web';
import App from './App';

import './style.css';

const app = document.getElementById('app');

if (app) {
  render(() => <App />, app);
}
