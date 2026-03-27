import type { ParentComponent } from 'solid-js';
import AuthProvider from './lib/providers/auth/AuthProvider';

const App: ParentComponent = (props) => {
  return (
    <>
      <AuthProvider>
        <h1>Provider level</h1>
        {props.children}
      </AuthProvider>
    </>
  );
};

export default App;
