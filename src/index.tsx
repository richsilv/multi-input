import * as React from "react";
import { render } from "react-dom";

import NMore from "./n-more";
// import MultiInput from "./multi-input";

import "./styles.css";
import "normalize.css/normalize.css";

class Example extends React.Component<{}> {
  render() {
    return (
      <main>
        <NMore names={["foo", "bar", "much longer", "qux"]} onDelete={() => void 0}/>
        {/* <MultiInput /> */}
      </main>
    );
  }
}

render(<Example />, document.getElementById("root"));
