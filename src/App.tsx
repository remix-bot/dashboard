import type { ParentComponent } from 'solid-js';
import AuthProvider from './lib/providers/auth/AuthProvider';
import Navbar from './components/Navbar';

const App: ParentComponent = (props) => {
  return (
    <>
      <AuthProvider>
        <Navbar></Navbar>
        {props.children}
      </AuthProvider>
    </>
  );
};

export default App;
