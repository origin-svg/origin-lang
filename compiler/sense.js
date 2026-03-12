class OriginSense {
  constructor(options = {}) {
    this.options = {
      inferAlt: true,
      inferRoles: true,
      inferAriaLabels: true,
      lazyImages: true,
      ...options
    };
    this.report = [];
  }

  analyze(ast) {
    const enrichedAst = this.walk(JSON.parse(JSON.stringify(ast)));
    return { ast: enrichedAst, report: this.report };
  }

  walk(node) {
    if (!node) return node;

    if (Array.isArray(node)) {
      return node.map(n => this.walk(n));
    }

    if (!node.sense) {
      node.sense = {};
    }

    switch (node.type) {
      case "image":
      case "img":
        this.handleImage(node);
        break;
      case "nav":
      case "navigation":
        this.handleNav(node);
        break;
      case "button":
      case "btn":
        this.handleButton(node);
        break;
      case "link":
      case "a":
        this.handleLink(node);
        break;
      case "input":
        this.handleInput(node);
        break;
      case "header":
        this.handleHeader(node);
        break;
      case "main":
        this.handleMain(node);
        break;
      case "footer":
        this.handleFooter(node);
        break;
      case "section":
        this.handleSection(node);
        break;
      case "title":
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        this.handleHeading(node);
        break;
      case "page":
      case "document":
        this.handlePage(node);
        break;
    }

    if (node.children) {
      node.children = this.walk(node.children);
    }
    if (node.body) {
      node.body = this.walk(node.body);
    }

    return node;
  }

  handleImage(node) {
    if (this.options.inferAlt && !node.alt) {
      node.sense.alt = this.inferAltFromSrc(node.src || node.value || "");
      this.report.push({ type: "infer-alt", node: node.type, value: node.sense.alt });
    }
    if (this.options.lazyImages) {
      node.sense.lazy = true;
    }
    if (this.options.inferRoles) {
      node.sense.role = "img";
    }
  }

  handleNav(node) {
    if (this.options.inferRoles) {
      node.sense.role = "navigation";
    }
    if (this.options.inferAriaLabels && !node.sense.ariaLabel) {
      node.sense.ariaLabel = node.label || "Navigation";
    }
  }

  handleButton(node) {
    if (this.options.inferRoles) {
      node.sense.role = "button";
    }
    if (this.options.inferAriaLabels && !node.sense.ariaLabel) {
      const text = this.extractText(node);
      if (text) node.sense.ariaLabel = text;
    }
  }

  handleLink(node) {
    if (this.options.inferRoles) {
      node.sense.role = "link";
    }
  }

  handleInput(node) {
    if (this.options.inferAriaLabels && node.placeholder && !node.sense.ariaLabel) {
      node.sense.ariaLabel = node.placeholder;
    }
  }

  handleHeader(node) {
    if (this.options.inferRoles) {
      node.sense.role = "banner";
    }
  }

  handleMain(node) {
    if (this.options.inferRoles) {
      node.sense.role = "main";
    }
  }

  handleFooter(node) {
    if (this.options.inferRoles) {
      node.sense.role = "contentinfo";
    }
  }

  handleSection(node) {
    if (this.options.inferRoles) {
      node.sense.role = "region";
    }
    if (this.options.inferAriaLabels && node.label) {
      node.sense.ariaLabel = node.label;
    }
  }

  handleHeading(node) {
    if (this.options.inferRoles) {
      node.sense.role = "heading";
    }
  }

  handlePage(node) {
    if (!this.hasTitle(node)) {
      this.report.push({ type: "missing-title", message: "Page is missing a title" });
      if (this.options.inferAriaLabels) {
        node.sense.ariaLabel = node.name || node.title || "Untitled Page";
      }
    }
  }

  hasTitle(node) {
    if (!node) return false;
    if (node.type === "title" || node.title) return true;
    const children = node.children || node.body || [];
    if (Array.isArray(children)) {
      return children.some(c => this.hasTitle(c));
    }
    return false;
  }

  inferAltFromSrc(src) {
    if (!src) return "image";
    const filename = src.split("/").pop().split("?")[0];
    const name = filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    return name || "image";
  }

  extractText(node) {
    if (typeof node === "string") return node;
    if (node.value) return node.value;
    if (node.text) return node.text;
    if (node.children && Array.isArray(node.children)) {
      return node.children.map(c => this.extractText(c)).filter(Boolean).join(" ");
    }
    return "";
  }
}

module.exports = { OriginSense };
