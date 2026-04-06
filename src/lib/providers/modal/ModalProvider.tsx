import { createContext, createSignal, JSX, ParentComponent, useContext } from "solid-js";

export type ModalContextType = {
  open: (channel: JSX.Element) => void;
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

  const close = () => {
    setContent(undefined);
  }
  const open = (c: JSX.Element) => {
    setContent(c);
  }

  return <ModalContext.Provider value={{
    close,
    open
  }}>
    <link rel="stylesheet" href="/src/styles/modal.css"></link>
    <div class="modalContainer" style={{
      display: (!!content()) ? "flex" : "none"
    }} onClick={(e) => {
      if (e.target.matches(".modalContainer *")) return;
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
