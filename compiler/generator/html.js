class HTMLGenerator {
  constructor(ast, options = {}) {
    this.ast = ast;
    this.options = options;
    this.indent = 0;
  }

  ln(content = "") {
    return "  ".repeat(this.indent) + content + "\n";
  }

  escape(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  toKebab(str) {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  }

  formatLabel(str) {
    return str
      .replace(/[-_]/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  generate() {
    let output = "";
    for (const page of this.ast.pages) {
      output += this.generatePage(page);
    }
    return output;
  }

  generatePage(page) {
    const title = page.title || this.formatLabel(page.name);
    const desc = page.description || "";
    const name = this.toKebab(page.name);

    let html = "";
    html += this.ln("<!DOCTYPE html>");
    html += this.ln(`<html lang="en">`);

    this.indent++;
    html += this.ln("<head>");
    this.indent++;
    html += this.ln('<meta charset="UTF-8">');
    html += this.ln(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    );
    html += this.ln(`<title>${this.escape(title)}</title>`);

    if (desc) {
      html += this.ln(
        `<meta name="description" content="${this.escape(desc)}">`
      );
    }

    if (page.meta && page.meta.ogTitle) {
      html += this.ln(
        `<meta property="og:title" content="${this.escape(page.meta.ogTitle)}">`
      );
    }
    if (page.meta && page.meta.ogDescription) {
      html += this.ln(
        `<meta property="og:description" content="${this.escape(page.meta.ogDescription)}">`
      );
    }

    if (this.options.cssFile) {
      html += this.ln(`<link rel="stylesheet" href="${name}.css">`);
    }

    this.indent--;
    html += this.ln("</head>");

    html += this.ln("<body>");
    this.indent++;

    for (const child of page.children) {
      html += this.generateNode(child);
    }

    if (this.options.jsFile) {
      html += this.ln(`<script src="${name}.js" defer></script>`);
    }

    this.indent--;
    html += this.ln("</body>");

    this.indent--;
    html += this.ln("</html>");

    return html;
  }

  generateNode(node) {
    if (!node) return "";

    switch (node.type) {
      case "Section":
        return this.generateSection(node);
      case "Heading":
        return this.generateHeading(node);
      case "Text":
        return this.generateText(node);
      case "Button":
        return this.generateButton(node);
      case "Image":
        return this.generateImage(node);
      case "Link":
        return this.generateLink(node);
      case "Nav":
        return this.generateNav(node);
      case "Footer":
        return this.generateFooter(node);
      case "Header":
        return this.generateHeader(node);
      case "Form":
        return this.generateForm(node);
      case "Input":
        return this.generateInput(node);
      case "Grid":
        return this.generateGrid(node);
      case "Card":
        return this.generateCard(node);
      case "List":
        return this.generateList(node);
      case "Icon":
        return this.generateIcon(node);
      case "Divider":
        return this.generateDivider();
      case "Spacer":
        return this.generateSpacer(node);
      case "Modal":
        return this.generateModal(node);
      case "Fetch":
        return this.generateFetch(node);
      default:
        return "";
    }
  }

  generateSection(node) {
    const id = this.toKebab(node.name);
    const role = node.sense && node.sense.role ? ` role="${node.sense.role}"` : "";
    const aria = node.sense && node.sense.ariaLabel
      ? ` aria-label="${this.escape(node.sense.ariaLabel)}"`
      : "";

    let html = this.ln(`<section id="${id}" class="section section--${id}"${role}${aria}>`);
    this.indent++;

    html += this.ln(`<div class="container">`);
    this.indent++;

    for (const child of node.children) {
      html += this.generateNode(child);
    }

    this.indent--;
    html += this.ln("</div>");

    this.indent--;
    html += this.ln("</section>");
    return html;
  }

  generateHeading(node) {
    const level = Math.min(Math.max(node.level || 2, 1), 6);
    return this.ln(`<h${level}>${this.escape(node.value)}</h${level}>`);
  }

  generateText(node) {
    if (node.bind) {
      return this.ln(
        `<p data-bind="${node.bind}">${this.escape(node.value)}</p>`
      );
    }
    return this.ln(`<p>${this.escape(node.value)}</p>`);
  }

  generateButton(node) {
    const variant = node.variant ? ` btn--${node.variant}` : "";
    let attrs = `class="btn${variant}"`;

    if (node.action) {
      if (node.action.type === "navigate") {
        return this.ln(
          `<a href="${this.escape(node.action.target)}" ${attrs}>${this.escape(node.label)}</a>`
        );
      } else if (node.action.type === "call") {
        attrs += ` data-action="${node.action.target}"`;
      }
    }

    if (node.sense && node.sense.ariaLabel) {
      attrs += ` aria-label="${this.escape(node.sense.ariaLabel)}"`;
    }

    return this.ln(`<button ${attrs}>${this.escape(node.label)}</button>`);
  }

  generateImage(node) {
    const alt = node.alt || (node.sense && node.sense.alt) || "";
    let attrs = `src="${this.escape(node.src)}" alt="${this.escape(alt)}"`;

    if (node.sense && node.sense.lazy) {
      attrs += ' loading="lazy" decoding="async"';
    }

    return this.ln(`<img ${attrs}>`);
  }

  generateLink(node) {
    const isExternal =
      node.url.startsWith("http://") || node.url.startsWith("https://");
    let attrs = `href="${this.escape(node.url)}"`;

    if (isExternal) {
      attrs += ' target="_blank" rel="noopener noreferrer"';
    }

    return this.ln(
      `<a ${attrs}>${this.escape(node.label)}</a>`
    );
  }

  generateNav(node) {
    let html = this.ln('<nav class="nav" role="navigation" aria-label="Main navigation">');
    this.indent++;

    html += this.ln('<div class="nav__container container">');
    this.indent++;

    html += this.ln(
      '<button class="nav__toggle" aria-label="Toggle menu" aria-expanded="false">'
    );
    this.indent++;
    html += this.ln("<span></span><span></span><span></span>");
    this.indent--;
    html += this.ln("</button>");

    html += this.ln('<div class="nav__links">');
    this.indent++;

    for (const child of node.children) {
      html += this.generateNode(child);
    }

    this.indent--;
    html += this.ln("</div>");

    this.indent--;
    html += this.ln("</div>");

    this.indent--;
    html += this.ln("</nav>");
    return html;
  }

  generateFooter(node) {
    let html = this.ln('<footer class="footer" role="contentinfo">');
    this.indent++;
    html += this.ln('<div class="container">');
    this.indent++;

    for (const child of node.children) {
      html += this.generateNode(child);
    }

    this.indent--;
    html += this.ln("</div>");
    this.indent--;
    html += this.ln("</footer>");
    return html;
  }

  generateHeader(node) {
    let html = this.ln('<header class="header" role="banner">');
    this.indent++;
    html += this.ln('<div class="container">');
    this.indent++;

    for (const child of node.children) {
      html += this.generateNode(child);
    }

    this.indent--;
    html += this.ln("</div>");
    this.indent--;
    html += this.ln("</header>");
    return html;
  }

  generateForm(node) {
    const id = this.toKebab(node.name);
    let html = this.ln(
      `<form id="form-${id}" class="form" data-form="${id}" novalidate>`
    );
    this.indent++;

    for (const child of node.children) {
      if (child.type === "Input") {
        html += this.ln('<div class="form__group">');
        this.indent++;
        html += this.generateInput(child);
        this.indent--;
        html += this.ln("</div>");
      } else {
        html += this.generateNode(child);
      }
    }

    this.indent--;
    html += this.ln("</form>");
    return html;
  }

  generateInput(node) {
    const id = this.toKebab(node.name);
    const label = this.formatLabel(node.name);
    let html = "";

    html += this.ln(`<label for="input-${id}">${this.escape(label)}</label>`);

    if (node.inputType === "textarea") {
      html += this.ln(
        `<textarea id="input-${id}" name="${id}" placeholder="${this.escape(node.placeholder)}" class="form__input"></textarea>`
      );
    } else {
      html += this.ln(
        `<input type="${node.inputType}" id="input-${id}" name="${id}" placeholder="${this.escape(node.placeholder)}" class="form__input">`
      );
    }

    return html;
  }

  generateGrid(node) {
    let html = this.ln(
      `<div class="grid grid--${node.columns}" style="--grid-cols: ${node.columns};">`
    );
    this.indent++;

    for (const child of node.children) {
      html += this.generateNode(child);
    }

    this.indent--;
    html += this.ln("</div>");
    return html;
  }

  generateCard(node) {
    const cls = node.name ? ` card--${this.toKebab(node.name)}` : "";
    let html = this.ln(`<div class="card${cls}">`);
    this.indent++;

    for (const child of node.children) {
      html += this.generateNode(child);
    }

    this.indent--;
    html += this.ln("</div>");
    return html;
  }

  generateList(node) {
    let html = this.ln('<ul class="list">');
    this.indent++;

    for (const child of node.children) {
      html += this.ln(`<li>${this.escape(child.value)}</li>`);
    }

    this.indent--;
    html += this.ln("</ul>");
    return html;
  }

  generateIcon(node) {
    return this.ln(
      `<span class="icon icon--${this.toKebab(node.name)}" aria-hidden="true"></span>`
    );
  }

  generateDivider() {
    return this.ln('<hr class="divider">');
  }

  generateSpacer(node) {
    return this.ln(`<div class="spacer spacer--${node.size}"></div>`);
  }

  generateModal(node) {
    const id = this.toKebab(node.name);
    let html = this.ln(
      `<div id="modal-${id}" class="modal" role="dialog" aria-modal="true" aria-hidden="true">`
    );
    this.indent++;

    html += this.ln('<div class="modal__overlay" data-modal-close></div>');
    html += this.ln('<div class="modal__content">');
    this.indent++;

    html += this.ln(
      '<button class="modal__close" data-modal-close aria-label="Close">&times;</button>'
    );

    for (const child of node.children) {
      html += this.generateNode(child);
    }

    this.indent--;
    html += this.ln("</div>");

    this.indent--;
    html += this.ln("</div>");
    return html;
  }

  generateFetch(node) {
    let html = this.ln(
      `<div class="fetch-container" data-fetch="${node.target}">`
    );
    this.indent++;

    html += this.ln(
      '<div class="fetch-loading">Loading...</div>'
    );
    html += this.ln('<div class="fetch-error" hidden></div>');
    html += this.ln('<div class="fetch-content">');
    this.indent++;

    for (const child of node.children) {
      html += this.generateNode(child);
    }

    this.indent--;
    html += this.ln("</div>");

    this.indent--;
    html += this.ln("</div>");
    return html;
  }
}

module.exports = { HTMLGenerator };
