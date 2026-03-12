function createNode(type, props = {}) {
  return { type, ...props };
}

const NodeTypes = {
  PROGRAM: "Program",
  PAGE: "Page",
  COMPONENT: "Component",
  SECTION: "Section",
  HEADING: "Heading",
  TEXT: "Text",
  BUTTON: "Button",
  IMAGE: "Image",
  LINK: "Link",
  NAV: "Nav",
  FOOTER: "Footer",
  HEADER: "Header",
  FORM: "Form",
  INPUT: "Input",
  GRID: "Grid",
  CARD: "Card",
  LIST: "List",
  LIST_ITEM: "ListItem",
  ICON: "Icon",
  DIVIDER: "Divider",
  SPACER: "Spacer",
  MODAL: "Modal",
  API: "Api",
  FETCH: "Fetch",
  STATE: "State",
  STYLE_BLOCK: "StyleBlock",
  META: "Meta",
};

module.exports = { createNode, NodeTypes };
