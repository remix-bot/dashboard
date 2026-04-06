import type { ParentComponent } from 'solid-js';
import AuthProvider from './lib/providers/auth/AuthProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VoiceProvider from './lib/providers/auth/VoiceProvider';
import ModalProvider from './lib/providers/modal/ModalProvider';
import NotificationProvider from './lib/providers/notifications/NotificationProvider';

const App: ParentComponent = (props) => {
  return (
    <>
      <NotificationProvider>
        <ModalProvider>
          <AuthProvider>
            <VoiceProvider>
              <Navbar></Navbar>
              {props.children}
              <Footer></Footer>
            </VoiceProvider>
          </AuthProvider>
        </ModalProvider>
      </NotificationProvider>
    </>
  );
};

export default App;
