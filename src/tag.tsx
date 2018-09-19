import * as React from "react";
import styled from "react-emotion";

const TagSurround = styled("span")({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  padding: "0.25em 0.5em 0.25em 0.75em",
  borderRadius: "100em",
  backgroundColor: "#D68910"
});

const TagName = styled("span")({
  display: "inline-block",
  verticalAlign: "text-top",
  color: "#fff",
  fontWeight: 600,
  height: "1em",
  lineHeight: "1em",
  marginRight: "0.5em"
});

const DeleteButton = styled("button")({
  display: "inline-block",
  verticalAlign: "center",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  fill: "#fff",
  width: "1em",
  height: "1em",
  border: "none",
  borderRadius: "0.5em",
  fontSize: "1em",
  lineHeight: "1em",
  cursor: "pointer",
  padding: " 0 0.25em"
});

const Cross: React.SFC<{}> = () => (
  <svg viewBox="0 0 100 100">
    <path
      xmlns="http://www.w3.org/2000/svg"
      d=" M 60 50 L 100 10 L 90 0 L 50 40 L 10 0 L 0 10 L 40 50 L 0 90 L 10 100 L 50 60 L 90 100 L 100 90 L 60 50 Z "
    />
  </svg>
);

export default class Tag extends React.PureComponent<{ onDelete: () => void }> {
  public render() {
    const { children, onDelete } = this.props;
    return (
      <TagSurround>
        <TagName>{children}</TagName>
        <DeleteButton type="button" onClick={onDelete}>
          <Cross />
        </DeleteButton>
      </TagSurround>
    );
  }
}
