import type { ParentComponent } from 'solid-js';

const App: ParentComponent = (props) => {
  return (
    <>
      <h1>Provider level</h1>
      {props.children}
    </>
  );
};

export default App;
