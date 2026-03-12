class CSSGenerator {
  constructor(ast) {
    this.ast = ast;
    this.components = new Set();
    this.sectionStyles = {};
    this.analyze(ast);
  }

  analyze(ast) {
    for (const page of ast.pages) {
      this.scanNodes(page.children);
    }
  }

  scanNodes(nodes) {
    for (const node of nodes) {
      this.components.add(node.type);

      if (node.type === "Section" && node.style) {
        this.sectionStyles[node.name] = node.style.properties;
      }

      if (node.children) {
        this.scanNodes(node.children);
      }
    }
  }

  generate() {
    let css = "";

    css += this.reset();
    css += this.base();
    css += this.typography();
    css += this.container();
    css += this.sections();
    css += this.buttons();

    if (this.components.has("Nav")) css += this.nav();
    if (this.components.has("Grid")) css += this.grid();
    if (this.components.has("Card")) css += this.card();
    if (this.components.has("Form") || this.components.has("Input"))
      css += this.form();
    if (this.components.has("List")) css += this.list();
    if (this.components.has("Footer")) css += this.footer();
    if (this.components.has("Modal")) css += this.modal();
    if (this.components.has("Divider")) css += this.divider();
    if (this.components.has("Spacer")) css += this.spacer();
    if (this.components.has("Fetch")) css += this.fetch();

    css += this.responsive();
    css += this.accessibility();

    return css;
  }

  resolveColor(value) {
    const palette = {
      dark: "#1a1a2e",
      light: "#ffffff",
      primary: "#2563eb",
      secondary: "#7c3aed",
      accent: "#f59e0b",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444",
      muted: "#f3f4f6",
      neutral: "#f8f9fa",
    };
    return palette[value] || value;
  }

  resolvePadding(value) {
    const sizes = {
      none: "0",
      small: "2rem 1rem",
      medium: "4rem 1rem",
      large: "6rem 1rem",
      xlarge: "8rem 1rem",
    };
    return sizes[value] || value;
  }

  reset() {
    return `/* Origin Engine — Generated Stylesheet */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  min-height: 100vh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

input, button, textarea, select {
  font: inherit;
}

`;
  }

  base() {
    return `body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  color: #1a1a2e;
  background-color: #ffffff;
}

a {
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: #1d4ed8;
}

`;
  }

  typography() {
    return `h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
  font-weight: 700;
  margin-bottom: 0.5em;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }
h5 { font-size: 1.1rem; }
h6 { font-size: 1rem; }

p {
  margin-bottom: 1rem;
  max-width: 65ch;
}

`;
  }

  container() {
    return `.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

`;
  }

  sections() {
    let css = `.section {
  padding: 4rem 0;
}

`;

    for (const [name, props] of Object.entries(this.sectionStyles)) {
      const kebab = name
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase();

      css += `.section--${kebab} {\n`;

      if (props.background) {
        const bg = this.resolveColor(props.background);
        css += `  background-color: ${bg};\n`;

        const darkColors = ["dark", "#1a1a2e", "#000", "#111"];
        if (darkColors.some((c) => props.background === c || bg === c)) {
          css += "  color: #ffffff;\n";
        }
      }

      if (props.padding) {
        css += `  padding: ${this.resolvePadding(props.padding)};\n`;
      }

      if (props.align) {
        css += `  text-align: ${props.align};\n`;
      }

      if (props.color) {
        css += `  color: ${this.resolveColor(props.color)};\n`;
      }

      css += "}\n\n";
    }

    return css;
  }

  buttons() {
    return `.btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #2563eb;
  color: #ffffff;
  text-decoration: none;
}

.btn:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn:active {
  transform: translateY(0);
}

.btn--secondary {
  background-color: #7c3aed;
}

.btn--secondary:hover {
  background-color: #6d28d9;
}

.btn--outline {
  background-color: transparent;
  color: #2563eb;
  border-color: #2563eb;
}

.btn--outline:hover {
  background-color: #2563eb;
  color: #ffffff;
}

`;
  }

  nav() {
    return `.nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 0;
}

.nav__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav__links a {
  font-weight: 500;
  color: #4b5563;
  padding: 0.25rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.nav__links a:hover {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.nav__toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.nav__toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background-color: #1a1a2e;
  transition: transform 0.3s ease;
}

`;
  }

  grid() {
    return `.grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-cols, 3), 1fr);
  gap: 1.5rem;
}

`;
  }

  card() {
    return `.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

`;
  }

  form() {
    return `.form {
  max-width: 500px;
}

.form__group {
  margin-bottom: 1.25rem;
}

.form__group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
}

.form__input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background-color: #ffffff;
}

.form__input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

textarea.form__input {
  min-height: 120px;
  resize: vertical;
}

`;
  }

  list() {
    return `.list {
  list-style: none;
  padding: 0;
}

.list li {
  padding: 0.625rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.list li:last-child {
  border-bottom: none;
}

`;
  }

  footer() {
    return `.footer {
  background-color: #1a1a2e;
  color: #9ca3af;
  padding: 2rem 0;
  text-align: center;
  font-size: 0.875rem;
}

.footer a {
  color: #d1d5db;
}

.footer a:hover {
  color: #ffffff;
}

`;
  }

  modal() {
    return `.modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal[aria-hidden="false"] {
  opacity: 1;
  visibility: visible;
}

.modal__overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal__content {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 560px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  z-index: 1;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal__close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
  padding: 0.25rem;
}

.modal__close:hover {
  color: #1a1a2e;
}

`;
  }

  divider() {
    return `.divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 2rem 0;
}

`;
  }

  spacer() {
    return `.spacer--small { height: 1rem; }
.spacer--medium { height: 2rem; }
.spacer--large { height: 4rem; }

`;
  }

  fetch() {
    return `.fetch-container {
  min-height: 100px;
}

.fetch-loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.fetch-error {
  text-align: center;
  padding: 1rem;
  color: #ef4444;
  background-color: #fef2f2;
  border-radius: 6px;
}

`;
  }

  responsive() {
    return `@media (max-width: 768px) {
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }

  .section { padding: 2.5rem 0; }

  .grid {
    grid-template-columns: 1fr;
  }

  .nav__toggle {
    display: flex;
  }

  .nav__links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #ffffff;
    flex-direction: column;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .nav__links.active {
    display: flex;
  }
}

@media (max-width: 480px) {
  .container { padding: 0 1rem; }
  .btn { width: 100%; }
}

`;
  }

  accessibility() {
    return `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

`;
  }
}

module.exports = { CSSGenerator };
