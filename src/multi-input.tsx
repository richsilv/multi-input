import * as React from "react";
import Downshift, { ControllerStateAndHelpers } from "downshift";
import * as keycode from "keycode";

const fuzzysearch = require("fuzzysearch");

interface IMultiSelectProps<T extends object> {
  readonly options: Set<T>;
  readonly optionToString: (item: T) => string;
  readonly onChange: (selection: Set<T>) => void;
  readonly customClasses: {
    container: string;
    input: string;
    results: string;
    listItem: string;
    hover: string;
  };
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
    isOpen,
    inputValue,
    highlightedIndex,
    setHighlightedIndex
  }: ControllerStateAndHelpers<T>) => {
    const { selected, value } = this.state;
    const {
      customClasses,
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
          !selected.has(option!) &&
          (matchOption
            ? matchOption(inputValue, option!)
            : fuzzysearch(
                inputValue.toLowerCase(),
                optionToString(option!).toLowerCase()
              )))
      );
    });

    let index: number = 0;
    const optionElements = filteredOptions.map(item => {
      const displayedItem = optionToString(item!);
      const className =
        customClasses.listItem +
        " list-item" +
        (index++ === highlightedIndex ? ` ${customClasses.hover}` : "");
      return (
        <div
          {...getItemProps({ item })}
          title={displayedItem}
          key={displayedItem}
          className={className}
          tabIndex="0"
        >
          {displayedItem}
        </div>
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
      <div className={`multi-select ${customClasses.container}`}>
        <div
          className={`multi-select-input ${customClasses.input}`}
          onClick={this.focusInput}
        >
          {selectedOptionElements}
          <input
            className="invisible"
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
        </div>
        {isOpen && optionElements.length ? (
          <div className={`results ${customClasses.results}`}>
            {optionElements}
          </div>
        ) : null}
      </div>
    );
  }

  private saveInputRef = (element: HTMLInputElement | null) => {
    this.inputRef = element;
  }

  private focusInput = () => {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }

  private onChange = (selectedOptions: Set<T>) => {
    return this.props.onChange(selectedOptions);
  }

  private onAdd = (option: T) => {
    this.setState(({ selected }) => {
      const newSelected = new Set(selected).add(option);
      this.onChange(newSelected);
      return { selected: newSelected, value: "" };
    });
  }

  private onRemove = (option: T) => () => {
    this.setState(({ selected }) => {
      const newSelected = new Set(selected);
      newSelected.delete(option);
      this.onChange(newSelected);
      return { selected: newSelected };
    });
  }

  private onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ value: event.currentTarget.value });
  }
}
