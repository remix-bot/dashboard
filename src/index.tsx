/* @refresh reload */
import { render } from 'solid-js/web';
import 'solid-devtools';
import { Route, Router } from "@solidjs/router";

import App from './App';
import Main from './components/routes/index';
import Commands from './components/routes/Commands';
import Dashboard from './components/routes/dashboard';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() =>
  <Router root={App}>
    <Route path={"/"} component={Main}></Route>
    <Route path={"/commands"} component={Commands}></Route>
    <Route path={"/dashboard"} component={Dashboard}></Route>
  </Router>
, root!);
