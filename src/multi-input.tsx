import * as React from "react";
import Downshift, { ControllerStateAndHelpers } from "downshift";
import * as keycode from "keycode";
import styled from "react-emotion";
import { Interpolation } from "create-emotion";

const fuzzysearch = require("fuzzysearch");

interface ICustomStyles {
  customStyles?: {
    container?: Interpolation;
    input?: Interpolation;
    results?: Interpolation;
    listItem?: Interpolation;
    hover?: Interpolation;
  };
}

interface IMultiSelectProps<T extends object> extends ICustomStyles {
  readonly options: Set<T>;
  readonly optionToString: (item: T) => string;
  readonly onChange: (selection: Set<T>) => void;
  readonly defaultIsOpen?: boolean;
  readonly selected?: Set<T>;
  readonly placeholder?: string;
  readonly showOptionsWhenEmpty?: boolean;
  readonly matchOption?: (inputValue: string, option: T) => boolean;
  readonly onBlur?: () => void;
  readonly onInputChange?: (event: React.FormEvent<HTMLInputElement>) => void;
  readonly onFocus?: () => void;
  readonly onKeyUp?: (event: React.KeyboardEvent<HTMLElement>) => void;
}

interface IMultiSelectState<T> {
  readonly selected: Set<T>;
  readonly value: string;
}

const MultiSelectContainer = styled("div")(
  {
    overflow: "visible",
    width: "100%",
    height: "auto",
    position: "relative",
    zIindex: 1
  },
  (props: ICustomStyles) =>
    props.customStyles ? props.customStyles.container : null
);

const Results = styled("div")(
  {
    position: "absolute",
    left: 0,
    top: "100%",
    width: "100%",
    overflowY: "auto",
    maxHeight: "50vh"
  },
  (props: ICustomStyles) =>
    props.customStyles ? props.customStyles.results : null
);

const Input = styled("input")((props: ICustomStyles) => ({
  border: "none",
  outline: "none",
  outlineWidth: 0,
  outlineColor: "transparent",
  width: "auto",
  flexGrow: 1,
  margin: "0.25em 0.5em 0.25em 0",
  padding: "0.25em"
}));

const InputContainer = styled("div")(
  {
    overflowX: "hidden",
    width: "100%",
    height: "100%",
    minHeight: "2.25em",
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    alignContent: "flex-start",
    padding: "calc(0.125em - 1px) calc(0.375em - 1px)",

    ":focus-within": {
      color: "red",
      borderColor: "red"
    }
  },
  (props: ICustomStyles) =>
    props.customStyles ? props.customStyles.input : null
);

interface IListItemProps extends ICustomStyles {
  active: boolean;
}

const ListItem = styled("li")(
  {
    cursor: "pointer"
  },
  (props: ICustomStyles) =>
    props.customStyles ? props.customStyles.listItem : null,
  (props: IListItemProps) =>
    props.customStyles && props.active ? props.customStyles.hover : null
);

export default class MultiSelect<T extends object> extends React.PureComponent<
  IMultiSelectProps<T>,
  IMultiSelectState<T>
> {
  private inputRef: HTMLInputElement | null = null;

  public constructor(props: IMultiSelectProps<T>) {
    super(props);
    this.state = {
      selected: props.selected || new Set<T>(),
      value: ""
    };
  }

  public render() {
    return (
      <Downshift
        onChange={this.onAdd}
        itemToString={this.props.optionToString}
        defaultIsOpen={this.props.defaultIsOpen}
      >
        {this.renderMultiSelect}
      </Downshift>
    );
  }

  private renderMultiSelect = ({
    getInputProps,
    getItemProps,
    getRootProps,
    isOpen,
    inputValue,
    highlightedIndex,
    setHighlightedIndex
  }: ControllerStateAndHelpers<T>) => {
    const { selected, value } = this.state;
    const {
      showOptionsWhenEmpty,
      placeholder,
      onFocus,
      onBlur,
      options,
      onKeyUp,
      optionToString,
      matchOption
    } = this.props;

    const filteredOptions = Array.from(options).filter(option => {
      return (
        (!inputValue && showOptionsWhenEmpty) ||
        (inputValue &&
          !selected.has(option) &&
          (matchOption
            ? matchOption(inputValue, option!)
            : fuzzysearch(
                inputValue.toLowerCase(),
                optionToString(option).toLowerCase()
              )))
      );
    });

    const optionElements = filteredOptions.map(item => {
      const displayedItem = optionToString(item!);
      return (
        <ListItem
          {...getItemProps({ item })}
          title={displayedItem}
          key={displayedItem}
          tabIndex="0"
        >
          {displayedItem}
        </ListItem>
      );
    });

    const selectedOptionElements = Array.from(selected).map(item => {
      const displayedItem = optionToString(item!);
      return (
        <span className="tag" title={displayedItem} key={displayedItem}>
          {displayedItem}
          <button className="delete is-small" onClick={this.onRemove(item!)} />
        </span>
      );
    });

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (event.which) {
        case keycode("tab"):
          if (isOpen) {
            event.preventDefault();
            setHighlightedIndex(
              ((highlightedIndex || -1) + 1) % filteredOptions.length
            );
          }
          break;
        case keycode("backspace"):
          if (value === "") {
            this.setState({
              selected: new Set(Array.from(selected).slice(0, -1))
            });
          }
          break;
        default:
          break;
      }
    };

    return (
      <MultiSelectContainer {...getRootProps({ refKey: "innerRef" })}>
        <InputContainer onClick={this.focusInput}>
          {selectedOptionElements}
          <Input
            {...getInputProps({
              placeholder,
              value,
              onBlur,
              onFocus,
              onKeyUp,
              onKeyDown,
              onChange: this.onInputChange
            })}
            ref={this.saveInputRef}
          />
        </InputContainer>
        {isOpen && optionElements.length ? (
          <Results>{optionElements}</Results>
        ) : null}
      </MultiSelectContainer>
    );
  };

  private saveInputRef = (element: HTMLInputElement | null) => {
    this.inputRef = element;
  };

  private focusInput = () => {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  };

  private onChange = (selectedOptions: Set<T>) => {
    return this.props.onChange(selectedOptions);
  };

  private onAdd = (option: T) => {
    this.setState(({ selected }) => {
      const newSelected = new Set(selected).add(option);
      this.onChange(newSelected);
      return { selected: newSelected, value: "" };
    });
  };

  private onRemove = (option: T) => () => {
    this.setState(({ selected }) => {
      const newSelected = new Set(selected);
      newSelected.delete(option);
      this.onChange(newSelected);
      return { selected: newSelected };
    });
  };

  private onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ value: event.currentTarget.value });
  };
}
