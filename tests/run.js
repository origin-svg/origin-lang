const { OriginCompiler } = require("../compiler");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err) {
    console.log(`  FAIL  ${name}`);
    console.log(`        ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed");
}

console.log("\nOrigin Engine — Test Suite\n");

const compiler = new OriginCompiler();

// Lexer and parser tests

test("compiles empty page", function () {
  const result = compiler.compile('page Test { title "Test" }');
  assert(result.html.includes("<title>Test</title>"), "should contain title");
  assert(result.html.includes("<!DOCTYPE html>"), "should have doctype");
});

test("compiles page with section", function () {
  const source = `
    page Home {
      title "Home"
      section hero {
        heading "Hello"
        text "World"
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes('id="hero"'), "should have section id");
  assert(result.html.includes("<h"), "should contain heading");
  assert(result.html.includes("<p>World</p>"), "should contain text");
});

test("compiles buttons with navigation", function () {
  const source = `
    page Home {
      title "Home"
      section main {
        button "Click" -> "#target"
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes('href="#target"'), "should generate link");
  assert(result.html.includes("Click"), "should contain label");
});

test("compiles navigation", function () {
  const source = `
    page Home {
      title "Home"
      nav {
        link "About" -> "/about"
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes("<nav"), "should contain nav");
  assert(result.html.includes('href="/about"'), "should contain link");
  assert(result.js.includes("nav__toggle"), "should generate nav JS");
});

test("compiles grid and cards", function () {
  const source = `
    page Home {
      title "Home"
      section features {
        grid 3 {
          card one {
            heading "Feature"
            text "Description"
          }
        }
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes("grid"), "should contain grid");
  assert(result.html.includes("card"), "should contain card");
  assert(result.css.includes(".grid"), "should generate grid CSS");
  assert(result.css.includes(".card"), "should generate card CSS");
});

test("compiles forms", function () {
  const source = `
    page Home {
      title "Home"
      section contact {
        form contact {
          input name "Your name"
          input email "Email" email
          button "Send" -> submit
        }
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes("<form"), "should contain form");
  assert(result.html.includes("<input"), "should contain input");
  assert(result.html.includes("<label"), "should contain label");
  assert(result.js.includes("form-submit"), "should generate form JS");
});

test("compiles modals", function () {
  const source = `
    page Home {
      title "Home"
      modal info {
        heading "Information"
        text "This is a modal."
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes('id="modal-info"'), "should have modal id");
  assert(result.html.includes('role="dialog"'), "should have dialog role");
  assert(result.js.includes("openModal"), "should generate modal JS");
});

test("generates CSS for sections with styles", function () {
  const source = `
    page Home {
      title "Home"
      section hero {
        style {
          background "dark"
          align "center"
          padding "large"
        }
        heading "Title"
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.css.includes("section--hero"), "should have section class");
  assert(result.css.includes("#1a1a2e"), "should resolve dark color");
});

test("compiles API and fetch", function () {
  const source = `
    page Home {
      title "Home"
      api users -> "https://api.example.com/users"
      section data {
        fetch users {
          text "Loaded"
        }
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes('data-fetch="users"'), "should have fetch attr");
  assert(
    result.js.includes("api.example.com"),
    "should contain API URL in JS"
  );
});

test("compiles state bindings", function () {
  const source = `
    page Home {
      title "Home"
      state counter 0
      section main {
        text "Count:" -> counter
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes('data-bind="counter"'), "should have binding");
  assert(result.js.includes("originState"), "should generate state JS");
  assert(result.js.includes("Proxy"), "should use reactive proxy");
});

test("Origin Sense infers missing title", function () {
  const source = `
    page MyDashboard {
      section hero {
        heading "Welcome"
      }
    }
  `;
  const result = compiler.compile(source);
  assert(
    result.html.includes("<title>My Dashboard</title>"),
    "should infer title from page name"
  );
  assert(
    result.report.warnings.some((w) => w.includes("missing title")),
    "should warn about missing title"
  );
});

test("Origin Sense adds image lazy loading", function () {
  const source = `
    page Home {
      title "Home"
      section gallery {
        image "photo.jpg"
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes('loading="lazy"'), "should add lazy loading");
});

test("Origin Sense infers alt text", function () {
  const source = `
    page Home {
      title "Home"
      section gallery {
        image "team-photo.jpg"
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes('alt="Team Photo"'), "should infer alt text");
});

test("compiles list", function () {
  const source = `
    page Home {
      title "Home"
      section info {
        list {
          item "First"
          item "Second"
          item "Third"
        }
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes("<ul"), "should contain list");
  assert(result.html.includes("<li>First</li>"), "should contain items");
});

test("compiles footer", function () {
  const source = `
    page Home {
      title "Home"
      footer {
        text "Copyright"
        link "GitHub" -> "https://github.com"
      }
    }
  `;
  const result = compiler.compile(source);
  assert(result.html.includes("<footer"), "should contain footer");
  assert(
    result.html.includes('target="_blank"'),
    "should make external link open in new tab"
  );
  assert(result.css.includes(".footer"), "should generate footer CSS");
});

test("responsive CSS is always generated", function () {
  const source = 'page Home { title "Home" }';
  const result = compiler.compile(source);
  assert(
    result.css.includes("@media (max-width: 768px)"),
    "should include responsive breakpoint"
  );
});

test("accessibility CSS is always generated", function () {
  const source = 'page Home { title "Home" }';
  const result = compiler.compile(source);
  assert(
    result.css.includes("prefers-reduced-motion"),
    "should include reduced motion media query"
  );
  assert(
    result.css.includes(":focus-visible"),
    "should include focus-visible styles"
  );
});

console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
