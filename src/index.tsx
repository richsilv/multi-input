import * as React from "react";
import { render } from "react-dom";

import MultiInput from "./multi-input";

import "./styles.css";
import "normalize.css/normalize.css";

interface IMultiSelectOption {
  name: string;
  id: number;
}

const multiSelectOptions = new Set<IMultiSelectOption>([
  { name: "January", id: 0 },
  { name: "February", id: 1 },
  { name: "March", id: 2 },
  { name: "April", id: 3 },
  { name: "May", id: 4 },
  { name: "June", id: 5 },
  { name: "July", id: 6 },
  { name: "August", id: 7 },
  { name: "September", id: 8 },
  { name: "October", id: 9 },
  { name: "November", id: 10 },
  { name: "December", id: 11 }
]);

const optionToString = (option: IMultiSelectOption) => option.name;

class Example extends React.Component<{}> {
  public render() {
    return (
      <main>
        <MultiInput
          options={multiSelectOptions}
          optionToString={optionToString}
          onChange={this.onChange}
        />
      </main>
    );
  }

  private onChange = () => void 0;
}

render(<Example />, document.getElementById("root"));
