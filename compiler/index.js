const { Lexer } = require("./lexer");
const { Parser } = require("./parser");
const { Generator } = require("./generator");
const { OriginSense } = require("./sense");

class OriginCompiler {
  constructor(senseOptions = {}) {
    this.senseOptions = {
      accessibility: true,
      seo: true,
      performance: true,
      responsive: true,
      security: true,
      ...senseOptions,
    };
  }

  compile(source) {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    const sense = new OriginSense(this.senseOptions);
    const { ast: enrichedAst, report } = sense.analyze(ast);

    const generator = new Generator();
    const output = generator.generate(enrichedAst);

    return {
      html: output.html,
      css: output.css,
      js: output.js,
      ast: enrichedAst,
      report,
    };
  }
}

module.exports = { OriginCompiler };
