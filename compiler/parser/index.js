class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  current() {
    return this.tokens[this.pos];
  }

  peek(offset = 0) {
    return this.tokens[this.pos + offset] || null;
  }

  eat(type, value) {
    const token = this.current();
    if (!token) {
      throw new SyntaxError(`Unexpected end of input, expected ${type}`);
    }
    if (token.type !== type || (value !== undefined && token.value !== value)) {
      throw new SyntaxError(
        `Expected ${type}${value ? ` "${value}"` : ""} but got ${token.type} "${token.value}" at line ${token.line}`
      );
    }
    this.pos++;
    return token;
  }

  match(type, value) {
    const token = this.current();
    if (!token) return false;
    if (token.type !== type) return false;
    if (value !== undefined && token.value !== value) return false;
    return true;
  }

  parse() {
    const program = { type: "Program", pages: [], components: [] };

    while (!this.match("EOF")) {
      if (this.match("KEYWORD", "page")) {
        program.pages.push(this.parsePage());
      } else if (this.match("KEYWORD", "component")) {
        program.components.push(this.parseComponent());
      } else {
        this.pos++;
      }
    }

    return program;
  }

  parsePage() {
    this.eat("KEYWORD", "page");
    const name = this.eat("IDENTIFIER").value;
    this.eat("LBRACE");

    const page = {
      type: "Page",
      name,
      title: null,
      description: null,
      children: [],
      meta: {},
    };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      const node = this.parsePageMember();
      if (node) {
        if (node.type === "Meta" && node.key === "title") {
          page.title = node.value;
        } else if (node.type === "Meta" && node.key === "description") {
          page.description = node.value;
        } else {
          page.children.push(node);
        }
      }
    }

    this.eat("RBRACE");
    return page;
  }

  parseComponent() {
    this.eat("KEYWORD", "component");
    const name = this.eat("IDENTIFIER").value;
    this.eat("LBRACE");

    const component = { type: "Component", name, children: [] };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      const node = this.parsePageMember();
      if (node) component.children.push(node);
    }

    this.eat("RBRACE");
    return component;
  }

  parsePageMember() {
    const token = this.current();

    if (token.type === "KEYWORD") {
      switch (token.value) {
        case "title":
        case "description":
          return this.parseMeta();
        case "section":
          return this.parseSection();
        case "heading":
          return this.parseHeading();
        case "text":
          return this.parseText();
        case "button":
          return this.parseButton();
        case "image":
          return this.parseImage();
        case "link":
          return this.parseLink();
        case "nav":
          return this.parseNav();
        case "footer":
          return this.parseFooter();
        case "header":
          return this.parseHeader();
        case "form":
          return this.parseForm();
        case "grid":
          return this.parseGrid();
        case "card":
          return this.parseCard();
        case "list":
          return this.parseList();
        case "icon":
          return this.parseIcon();
        case "divider":
          return this.parseDivider();
        case "spacer":
          return this.parseSpacer();
        case "modal":
          return this.parseModal();
        case "api":
          return this.parseApi();
        case "fetch":
          return this.parseFetch();
        case "state":
          return this.parseState();
        case "style":
          return this.parseStyle();
        default:
          this.pos++;
          return null;
      }
    }

    this.pos++;
    return null;
  }

  parseMeta() {
    const key = this.eat("KEYWORD").value;
    const value = this.eat("STRING").value;
    return { type: "Meta", key, value };
  }

  parseSection() {
    this.eat("KEYWORD", "section");
    const name = this.eat("IDENTIFIER").value;
    this.eat("LBRACE");

    const section = {
      type: "Section",
      name,
      children: [],
      style: null,
    };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      if (this.match("KEYWORD", "style")) {
        section.style = this.parseStyleBlock();
      } else {
        const node = this.parsePageMember();
        if (node) section.children.push(node);
      }
    }

    this.eat("RBRACE");
    return section;
  }

  parseStyleBlock() {
    this.eat("KEYWORD", "style");
    this.eat("LBRACE");

    const properties = {};

    while (!this.match("RBRACE") && !this.match("EOF")) {
      if (this.match("IDENTIFIER") || this.match("KEYWORD")) {
        const key = this.current().value;
        this.pos++;
        const value = this.eat("STRING").value;
        properties[key] = value;
      } else {
        this.pos++;
      }
    }

    this.eat("RBRACE");
    return { type: "StyleBlock", properties };
  }

  parseStyle() {
    return this.parseStyleBlock();
  }

  parseHeading() {
    this.eat("KEYWORD", "heading");
    const value = this.eat("STRING").value;
    let level = 2;
    if (this.match("NUMBER")) {
      level = this.eat("NUMBER").value;
    }
    return { type: "Heading", value, level };
  }

  parseText() {
    this.eat("KEYWORD", "text");
    const value = this.eat("STRING").value;
    let bind = null;

    if (this.match("ARROW")) {
      this.eat("ARROW");
      bind = this.eat("IDENTIFIER").value;
    }

    return { type: "Text", value, bind };
  }

  parseButton() {
    this.eat("KEYWORD", "button");
    const label = this.eat("STRING").value;
    let action = null;
    let variant = null;

    if (this.match("ARROW")) {
      this.eat("ARROW");
      if (this.match("STRING")) {
        action = { type: "navigate", target: this.eat("STRING").value };
      } else if (this.match("IDENTIFIER")) {
        action = { type: "call", target: this.eat("IDENTIFIER").value };
      }
    }

    if (this.match("IDENTIFIER")) {
      variant = this.eat("IDENTIFIER").value;
    }

    return { type: "Button", label, action, variant };
  }

  parseImage() {
    this.eat("KEYWORD", "image");
    const src = this.eat("STRING").value;
    let alt = "";

    if (this.match("STRING")) {
      alt = this.eat("STRING").value;
    }

    return { type: "Image", src, alt };
  }

  parseLink() {
    this.eat("KEYWORD", "link");
    const label = this.eat("STRING").value;
    this.eat("ARROW");
    const url = this.eat("STRING").value;
    return { type: "Link", label, url };
  }

  parseNav() {
    this.eat("KEYWORD", "nav");
    this.eat("LBRACE");

    const nav = { type: "Nav", children: [] };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      if (this.match("KEYWORD", "link")) {
        nav.children.push(this.parseLink());
      } else if (this.match("KEYWORD", "button")) {
        nav.children.push(this.parseButton());
      } else if (this.match("KEYWORD", "text")) {
        nav.children.push(this.parseText());
      } else if (this.match("KEYWORD", "image")) {
        nav.children.push(this.parseImage());
      } else {
        this.pos++;
      }
    }

    this.eat("RBRACE");
    return nav;
  }

  parseFooter() {
    this.eat("KEYWORD", "footer");
    this.eat("LBRACE");

    const footer = { type: "Footer", children: [] };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      const node = this.parsePageMember();
      if (node) footer.children.push(node);
    }

    this.eat("RBRACE");
    return footer;
  }

  parseHeader() {
    this.eat("KEYWORD", "header");
    this.eat("LBRACE");

    const header = { type: "Header", children: [] };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      const node = this.parsePageMember();
      if (node) header.children.push(node);
    }

    this.eat("RBRACE");
    return header;
  }

  parseForm() {
    this.eat("KEYWORD", "form");
    const name = this.eat("IDENTIFIER").value;
    this.eat("LBRACE");

    const form = { type: "Form", name, children: [] };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      if (this.match("KEYWORD", "input")) {
        form.children.push(this.parseInput());
      } else if (this.match("KEYWORD", "button")) {
        form.children.push(this.parseButton());
      } else if (this.match("KEYWORD", "text")) {
        form.children.push(this.parseText());
      } else {
        this.pos++;
      }
    }

    this.eat("RBRACE");
    return form;
  }

  parseInput() {
    this.eat("KEYWORD", "input");
    const name = this.eat("IDENTIFIER").value;

    let placeholder = "";
    let inputType = "text";

    if (this.match("STRING")) {
      placeholder = this.eat("STRING").value;
    }

    if (this.match("IDENTIFIER")) {
      inputType = this.eat("IDENTIFIER").value;
    }

    return {
      type: "Input",
      name,
      placeholder,
      inputType,
    };
  }

  parseGrid() {
    this.eat("KEYWORD", "grid");

    let columns = 3;
    if (this.match("NUMBER")) {
      columns = this.eat("NUMBER").value;
    }

    this.eat("LBRACE");

    const grid = { type: "Grid", columns, children: [] };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      if (this.match("KEYWORD", "card")) {
        grid.children.push(this.parseCard());
      } else {
        const node = this.parsePageMember();
        if (node) grid.children.push(node);
      }
    }

    this.eat("RBRACE");
    return grid;
  }

  parseCard() {
    this.eat("KEYWORD", "card");

    let name = "";
    if (this.match("IDENTIFIER")) {
      name = this.eat("IDENTIFIER").value;
    } else if (this.match("STRING")) {
      name = this.eat("STRING").value;
    }

    this.eat("LBRACE");

    const card = { type: "Card", name, children: [], style: null };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      if (this.match("KEYWORD", "style")) {
        card.style = this.parseStyleBlock();
      } else {
        const node = this.parsePageMember();
        if (node) card.children.push(node);
      }
    }

    this.eat("RBRACE");
    return card;
  }

  parseList() {
    this.eat("KEYWORD", "list");
    this.eat("LBRACE");

    const list = { type: "List", children: [] };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      if (this.match("KEYWORD", "item")) {
        this.eat("KEYWORD", "item");
        const value = this.eat("STRING").value;
        list.children.push({ type: "ListItem", value });
      } else {
        this.pos++;
      }
    }

    this.eat("RBRACE");
    return list;
  }

  parseIcon() {
    this.eat("KEYWORD", "icon");
    const name = this.eat("STRING").value;
    return { type: "Icon", name };
  }

  parseDivider() {
    this.eat("KEYWORD", "divider");
    return { type: "Divider" };
  }

  parseSpacer() {
    this.eat("KEYWORD", "spacer");
    let size = "medium";
    if (this.match("STRING")) {
      size = this.eat("STRING").value;
    }
    return { type: "Spacer", size };
  }

  parseModal() {
    this.eat("KEYWORD", "modal");
    const name = this.eat("IDENTIFIER").value;
    this.eat("LBRACE");

    const modal = { type: "Modal", name, children: [] };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      const node = this.parsePageMember();
      if (node) modal.children.push(node);
    }

    this.eat("RBRACE");
    return modal;
  }

  parseApi() {
    this.eat("KEYWORD", "api");
    const name = this.eat("IDENTIFIER").value;
    this.eat("ARROW");
    const url = this.eat("STRING").value;
    return { type: "Api", name, url };
  }

  parseFetch() {
    this.eat("KEYWORD", "fetch");
    const target = this.eat("IDENTIFIER").value;
    this.eat("LBRACE");

    const fetchNode = { type: "Fetch", target, children: [] };

    while (!this.match("RBRACE") && !this.match("EOF")) {
      const node = this.parsePageMember();
      if (node) fetchNode.children.push(node);
    }

    this.eat("RBRACE");
    return fetchNode;
  }

  parseState() {
    this.eat("KEYWORD", "state");
    const name = this.eat("IDENTIFIER").value;

    let defaultValue = null;
    if (this.match("STRING")) {
      defaultValue = this.eat("STRING").value;
    } else if (this.match("NUMBER")) {
      defaultValue = this.eat("NUMBER").value;
    }

    return { type: "State", name, defaultValue };
  }
}

module.exports = { Parser };
