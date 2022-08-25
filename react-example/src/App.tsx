import React from 'react';
import './App.css';
import LspConnectedEditor from "./component/lsp-connected-editor";
import {AnotherEditor, CodeEditor} from "./component/test-editor";

function App() {
  return (
      <div>
        {/*<h2>Monaco Editor Sample (controlled mode)</h2>*/}
        {/*<CodeEditor />*/}
        {/*<hr />*/}
        {/*<h2>Another editor (uncontrolled mode)</h2>*/}
        {/*<AnotherEditor />*/}
        {/*<hr />*/}
        <LspConnectedEditor />
      </div>

  );
}

export default App;
