const { HTMLGenerator } = require("./html");
const { CSSGenerator } = require("./css");
const { JSGenerator } = require("./js");

class Generator {
  generate(ast) {
    const cssGen = new CSSGenerator(ast);
    const css = cssGen.generate();

    const jsGen = new JSGenerator(ast);
    const js = jsGen.generate();

    const htmlGen = new HTMLGenerator(ast, {
      cssFile: css.trim().length > 0,
      jsFile: js.trim().length > 0,
    });
    const html = htmlGen.generate();

    return { html, css, js };
  }
}

module.exports = { Generator };
