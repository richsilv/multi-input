import * as React from "react";
import styled from "react-emotion";
import posed from "react-pose";
import Tag from "./tag";

const Container = styled(
  posed.span({
    hoverable: true
  })
)({
  display: "inline-block"
});

const TagSurround = styled(
  posed.span({
    hoverable: true,
    init: {
      backgroundColor: "#D68910"
    },
    hover: {
      backgroundColor: "#c68008"
    }
  })
)({
  padding: "0.25em 0.5em 0.25em 0.75em",
  borderRadius: "100em"
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

const ItemList = styled(
  posed.ul({
    init: {
      height: 0,
      delay: 200,
      staggerChildren: 40
    },
    hover: {
      height: "auto",
      delayChildren: 200,
      staggerChildren: 40
    }
  })
)({
  overflow: "hidden",
  position: "absolute",
  margin: 0,
  padding: "0.25em 0.5em 0.25em 1em",
  borderRadius: "1em",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch"
});

const Spacer = styled("div")({
  height: "0.5em"
});

const Item = styled(
  posed.li({
    init: {
      x: "-10px",
      opacity: 0
    },
    hover: {
      x: 0,
      opacity: 1
    }
  })
)({
  listStyleType: "none",
  padding: 0,
  margin: "0 0 0.25em 0",
  display: "flex",
  alignItems: "stretch"
});

interface INMoreProps {
  names: Array<string>;
  onDelete: () => void;
}

export default class NMore extends React.PureComponent<INMoreProps> {
  public render() {
    const { names, onDelete } = this.props;
    return (
      <Container>
        <TagSurround>
          <TagName>{names.length} more</TagName>
        </TagSurround>
        <Spacer />
        <ItemList>
          {names.map(name => (
            <Item>
              <Tag onDelete={onDelete}>{name}</Tag>
            </Item>
          ))}
        </ItemList>
      </Container>
    );
  }
}
