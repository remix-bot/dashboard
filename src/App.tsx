import type { ParentComponent } from 'solid-js';
import AuthProvider from './lib/providers/auth/AuthProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App: ParentComponent = (props) => {
  return (
    <>
      <AuthProvider>
        <Navbar></Navbar>
        {props.children}
        <Footer></Footer>
      </AuthProvider>
    </>
  );
};

export default App;
