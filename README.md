Origin
An open-source language that compiles to HTML, CSS, and JavaScript.

What is Origin
Origin is a compiler toolchain that lets you build production-ready websites using a single declarative language called Origin Script. The Origin Engine compiles your code into optimized, accessible, and performant web pages with zero configuration and zero dependencies.
Origin is fully open source under the MIT license. Anyone can use it, modify it, contribute to it, and build on top of it.

The Problem
Modern web development requires juggling multiple languages and tools simultaneously. HTML handles structure, CSS handles presentation, JavaScript handles behavior, and on top of that developers must configure bundlers, preprocessors, frameworks, and package managers.
Origin replaces that entire workflow with a single language and a single command.

How It Works
You write Origin Script:
originDownloadCopy codepage Home {
  title "My Website"

  section hero {
    style {
      background "dark"
      align "center"
      padding "large"
    }
    heading "Welcome"
    text "Build the web with less code."
    button "Get Started" -> "#features"
  }

  section features {
    heading "Why Origin"
    grid 3 {
      card {
        heading "Simple"
        text "One language for everything."
      }
      card {
        heading "Fast"
        text "Compiles in milliseconds."
      }
      card {
        heading "Smart"
        text "Automatic optimizations built in."
      }
    }
  }

  footer {
    text "Built with Origin"
  }
}
The Origin Engine compiles it into production-ready HTML, CSS, and JavaScript.

Quick Start
Install
bashDownloadCopy codegit clone https://github.com/origin-lang/origin.git
cd origin
npm link
Create a Project
bashDownloadCopy codeorigin create my-site
cd my-site
Build
bashDownloadCopy codeorigin build
Preview
bashDownloadCopy codeorigin serve
Starts a local server at http://localhost:3000.

Language Reference
Pages
originDownloadCopy codepage Home {
  title "My Website"
  description "A site built with Origin."
}
Sections
originDownloadCopy codesection hero {
  style {
    background "dark"
    align "center"
    padding "large"
  }
  heading "Hello, World"
}
Background tokens: dark, light, primary, secondary, accent, success, warning, danger, muted, neutral.
Padding tokens: none, small, medium, large, xlarge.
Elements
originDownloadCopy codeheading "Title"
text "Paragraph content."
button "Click Me" -> "#target"
button "Submit" -> handleSubmit
image "photo.jpg" "Alt description"
link "Label" -> "https://example.com"
icon "search"
divider
spacer "large"
Navigation
originDownloadCopy codenav {
  link "Home" -> "/"
  link "About" -> "/about"
  button "Sign Up" -> "/signup"
}
Generates a responsive navbar with mobile toggle, keyboard accessibility, and ARIA attributes.
Grids and Cards
originDownloadCopy codegrid 3 {
  card {
    heading "Feature"
    text "Description."
  }
}
Forms
originDownloadCopy codeform contact {
  input name "Your name"
  input email "Email address" email
  input message "Your message" textarea
  button "Send" -> submitForm
}
Modals
originDownloadCopy codemodal signup {
  heading "Create Account"
  form register {
    input username "Username"
    input password "Password" password
    button "Register" -> register
  }
}
Lists
originDownloadCopy codelist {
  item "First entry"
  item "Second entry"
  item "Third entry"
}
API Integration
originDownloadCopy codeapi users -> "https://api.example.com/users"

section data {
  fetch users {
    text "User data will appear here."
  }
}
Reactive State
originDownloadCopy codestate counter 0

section display {
  text "Current count:" -> counter
}
Access state in the browser via window.originState.
Comments
originDownloadCopy code// Single-line comment

/* Multi-line
   comment */
Footer
originDownloadCopy codefooter {
  text "Copyright 2026"
  link "GitHub" -> "https://github.com"
}
External links automatically receive target="_blank" and rel="noopener noreferrer".

Architecture
The Origin Engine follows a four-stage compiler pipeline.
Stage 1 — Lexer. Tokenizes source code into keywords, identifiers, strings, numbers, and symbols. Handles comments and escape sequences. Tracks line and column numbers for error reporting.
Stage 2 — Parser. Recursive descent parser that consumes tokens and produces an Abstract Syntax Tree. Each language construct has a dedicated parsing method with clear error messages.
Stage 3 — Origin Sense. Semantic analysis layer that enriches the AST with accessibility attributes, SEO metadata, performance hints, and security measures. This is what makes Origin different from a template engine.
Stage 4 — Generators. Three generators convert the enriched AST into HTML, CSS, and JavaScript. The JS generator is conditional and only emits a file when interactive features are present.
.origin file -> Lexer -> Parser -> Sense -> Generator -> .html + .css + .js


Origin Sense — Semantic Intent Engine
Origin Sense is a semantic analysis layer built into the compiler that understands what you are building and applies optimizations automatically.
When you write section hero, Sense recognizes the word "hero" and applies role="banner" and an appropriate aria-label. When you write image "team-photo.jpg", Sense infers alt="Team Photo" from the filename and adds loading="lazy". When you write a form, Sense applies novalidate for custom validation control.
Accessibility: ARIA roles and labels, heading hierarchy correction, alt text inference, keyboard navigation attributes, focus management for modals, screen reader utility classes.
SEO: Title inference from page names, meta description generation from content, Open Graph tags, semantic HTML structure.
Performance: Image lazy loading and async decoding, conditional JS emission, minimal CSS output with only used component styles.
Security: External links get rel="noopener noreferrer". Forms use novalidate for custom validation.
Section intent detection:

* hero -> role="banner"
* about -> aria-label="About section"
* features -> aria-label="Features section"
* pricing -> aria-label="Pricing section"
* contact -> aria-label="Contact section"
* faq -> aria-label="Frequently asked questions"
* testimonials -> aria-label="Testimonials"
* team -> aria-label="Team members"
* gallery -> aria-label="Image gallery"
* services -> aria-label="Our services"
* blog -> aria-label="Blog posts"
* portfolio -> aria-label="Portfolio"

Every build produces a report with warnings and enhancements displayed in the terminal.

Configuration
jsonDownloadCopy code{
  "name": "my-site",
  "version": "1.0.0",
  "entry": "src/index.origin",
  "output": "dist",
  "sense": {
    "accessibility": true,
    "seo": true,
    "performance": true,
    "responsive": true,
    "security": true
  }
}

CLI Commands
origin create <name>     Create a new project
origin build             Compile .origin files to dist/
origin serve             Build and start local server on port 3000
origin help              Show available commands


Project Structure
origin/
  package.json
  LICENSE
  README.md
  CONTRIBUTING.md
  cli/
    index.js
  compiler/
    index.js
    lexer/
      index.js
    parser/
      index.js
    ast/
      nodes.js
    generator/
      index.js
      html.js
      css.js
      js.js
    sense/
      index.js
  examples/
    landing.origin
    blog.origin
    api-dashboard.origin
  tests/
    run.js


Roadmap
v0.1 — Foundation: Core lexer, parser, and HTML generation.
v0.2 — Components: Grids, cards, forms, lists, modals, CSS generation.
v0.3 — Interactivity: JS generation, navigation, modals, forms, state, API fetch.
v0.5 — Sense: Full semantic analysis engine.
v1.0 — Stable Release: Production-ready compiler and complete documentation.
Future: Custom theming, multi-page routing, server-side rendering, plugin architecture, VS Code extension.

FAQ
Is Origin a framework? No. Origin is a compiled language. It produces static HTML, CSS, and JavaScript files.
Does Origin replace React/Vue/Svelte? Origin targets websites, landing pages, documentation, and content-driven applications. For complex single-page applications with heavy client-side state, a framework may be more appropriate.
Can I use custom CSS or JavaScript? Yes. The generated output is standard and can be extended. JavaScript dispatches custom events (origin:form-submit, origin:action, origin:fetch-complete) that you can listen for in your own scripts.
Does Origin have dependencies? The compiler has zero runtime dependencies. It runs on Node.js using only built-in modules.
How fast is compilation? A typical page compiles in under 10 milliseconds.
Can I deploy the output anywhere? Yes. The output is static files that work on any hosting provider, CDN, or local server.

Running Tests
bashDownloadCopy codenpm test

License
MIT. See LICENSE file.

Contributing
See CONTRIBUTING.md for guidelines on how to contribute to Origin.
