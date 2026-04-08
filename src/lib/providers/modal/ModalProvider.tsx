import "../../../styles/modal.css";

import { createContext, createSignal, JSX, ParentComponent, useContext } from "solid-js";

export type ModalContextType = {
  open: (channel: JSX.Element, onCancelled: () => any) => void;
  close: () => void;
}

export const ModalContext = createContext<ModalContextType>();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal: cannot find a ModalContext");
  return context;
}

const ModalProvider: ParentComponent = (props) => {
  const [content, setContent] = createSignal<JSX.Element>(undefined);

  /*setTimeout(() => {
    setContent(<h1>Hi, how are you?</h1>);
    }, 1000);*/

  var onCancel: () => any | undefined;

  const close = () => {
    setContent(undefined);
  }
  const open = (c: JSX.Element, onCancelled: () => any) => {
    setContent(c);
    onCancel = onCancelled;
  }

  return <ModalContext.Provider value={{
    close,
    open
  }}>
    <div class="modalContainer" style={{
      display: (!!content()) ? "flex" : "none"
    }} onClick={(e) => {
      if (e.target.matches(".modalContainer *")) return;
      if (onCancel) onCancel();
      close();
    }}>
      <div class="modalContent">
        <a style="position: absolute; right: 0.75rem; top: 0.75rem;" href="javascript:;" onClick={() => {
          close()
        }}>X</a>
        {content()}
      </div>
    </div>
    {props.children}
  </ModalContext.Provider>
}

export default ModalProvider;
