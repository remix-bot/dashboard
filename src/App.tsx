import type { ParentComponent } from 'solid-js';
import AuthProvider from './lib/providers/auth/AuthProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VoiceProvider from './lib/providers/auth/VoiceProvider';

const App: ParentComponent = (props) => {
  return (
    <>
      <AuthProvider>
        <VoiceProvider>
          <Navbar></Navbar>
          {props.children}
          <Footer></Footer>
        </VoiceProvider>
      </AuthProvider>
    </>
  );
};

export default App;
