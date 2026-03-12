const KEYWORDS = new Set([
  "page",
  "section",
  "component",
  "style",
  "heading",
  "text",
  "button",
  "image",
  "link",
  "nav",
  "footer",
  "header",
  "form",
  "input",
  "grid",
  "card",
  "list",
  "item",
  "icon",
  "divider",
  "spacer",
  "modal",
  "title",
  "description",
  "api",
  "fetch",
  "state",
  "on",
  "import",
  "from",
]);

class Token {
  constructor(type, value, line, col) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.col = col;
  }
}

class Lexer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
    this.tokens = [];
  }

  peek() {
    return this.pos < this.source.length ? this.source[this.pos] : null;
  }

  advance() {
    const ch = this.source[this.pos];
    this.pos++;
    if (ch === "\n") {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }
    return ch;
  }

  skipWhitespace() {
    while (this.pos < this.source.length) {
      const ch = this.source[this.pos];
      if (ch === " " || ch === "\t" || ch === "\r" || ch === "\n") {
        this.advance();
      } else {
        break;
      }
    }
  }

  skipComment() {
    if (
      this.pos < this.source.length - 1 &&
      this.source[this.pos] === "/" &&
      this.source[this.pos + 1] === "/"
    ) {
      while (this.pos < this.source.length && this.source[this.pos] !== "\n") {
        this.advance();
      }
      return true;
    }

    if (
      this.pos < this.source.length - 1 &&
      this.source[this.pos] === "/" &&
      this.source[this.pos + 1] === "*"
    ) {
      this.advance();
      this.advance();
      while (this.pos < this.source.length - 1) {
        if (
          this.source[this.pos] === "*" &&
          this.source[this.pos + 1] === "/"
        ) {
          this.advance();
          this.advance();
          return true;
        }
        this.advance();
      }
      throw new SyntaxError(
        `Unterminated block comment at line ${this.line}`
      );
    }

    return false;
  }

  readString() {
    const quote = this.advance();
    let value = "";
    while (this.pos < this.source.length) {
      const ch = this.source[this.pos];
      if (ch === "\\") {
        this.advance();
        const escaped = this.advance();
        switch (escaped) {
          case "n":
            value += "\n";
            break;
          case "t":
            value += "\t";
            break;
          case "\\":
            value += "\\";
            break;
          case '"':
            value += '"';
            break;
          case "'":
            value += "'";
            break;
          default:
            value += escaped;
        }
      } else if (ch === quote) {
        this.advance();
        return value;
      } else {
        value += this.advance();
      }
    }
    throw new SyntaxError(`Unterminated string at line ${this.line}`);
  }

  readIdentifier() {
    let value = "";
    while (this.pos < this.source.length) {
      const ch = this.source[this.pos];
      if (/[a-zA-Z0-9_\-]/.test(ch)) {
        value += this.advance();
      } else {
        break;
      }
    }
    return value;
  }

  readNumber() {
    let value = "";
    while (this.pos < this.source.length) {
      const ch = this.source[this.pos];
      if (/[0-9.]/.test(ch)) {
        value += this.advance();
      } else {
        break;
      }
    }
    return parseFloat(value);
  }

  tokenize() {
    while (this.pos < this.source.length) {
      this.skipWhitespace();
      if (this.pos >= this.source.length) break;
      if (this.skipComment()) continue;

      const ch = this.source[this.pos];
      const line = this.line;
      const col = this.col;

      if (ch === '"' || ch === "'") {
        const value = this.readString();
        this.tokens.push(new Token("STRING", value, line, col));
        continue;
      }

      if (/[a-zA-Z_]/.test(ch)) {
        const value = this.readIdentifier();
        const type = KEYWORDS.has(value) ? "KEYWORD" : "IDENTIFIER";
        this.tokens.push(new Token(type, value, line, col));
        continue;
      }

      if (/[0-9]/.test(ch)) {
        const value = this.readNumber();
        this.tokens.push(new Token("NUMBER", value, line, col));
        continue;
      }

      switch (ch) {
        case "{":
          this.tokens.push(new Token("LBRACE", "{", line, col));
          this.advance();
          break;
        case "}":
          this.tokens.push(new Token("RBRACE", "}", line, col));
          this.advance();
          break;
        case "(":
          this.tokens.push(new Token("LPAREN", "(", line, col));
          this.advance();
          break;
        case ")":
          this.tokens.push(new Token("RPAREN", ")", line, col));
          this.advance();
          break;
        case "-":
          if (
            this.pos + 1 < this.source.length &&
            this.source[this.pos + 1] === ">"
          ) {
            this.tokens.push(new Token("ARROW", "->", line, col));
            this.advance();
            this.advance();
          } else {
            this.tokens.push(new Token("SYMBOL", "-", line, col));
            this.advance();
          }
          break;
        case ",":
          this.tokens.push(new Token("COMMA", ",", line, col));
          this.advance();
          break;
        case ":":
          this.tokens.push(new Token("COLON", ":", line, col));
          this.advance();
          break;
        case "@":
          this.tokens.push(new Token("AT", "@", line, col));
          this.advance();
          break;
        case "#":
          this.tokens.push(new Token("HASH", "#", line, col));
          this.advance();
          break;
        default:
          this.advance();
      }
    }

    this.tokens.push(new Token("EOF", null, this.line, this.col));
    return this.tokens;
  }
}

module.exports = { Lexer, Token };
