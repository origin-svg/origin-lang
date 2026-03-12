# Origin

**An open-source language that compiles to HTML, CSS, and JavaScript.**

Origin is a compiler toolchain that lets you build production-ready websites using a single declarative language called **Origin Script**. The **Origin Engine** compiles your code into optimized, accessible, and performant web pages with zero configuration and zero dependencies.

Fully open source under the MIT license.

---

## Quick Start

````bash
git clone https://github.com/origin-lang/origin.git
cd origin
npm link
origin create my-site
cd my-site
origin build
origin serve

Your site is live at http://localhost:3000.

Example
originDownloadCopy codepage Home {
  title "My Website"
  description "Built with Origin."

  nav {
    link "Home" -> "/"
    link "About" -> "/about"
    button "Sign Up" -> "/signup"
  }

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
One file. One command. Full website.

Language Reference
Pages
originDownloadCopy codepage Home {
  title "My Website"
  description "A site built with Origin."
}
Sections with Styling
originDownloadCopy codesection hero {
  style {
    background "dark"
    align "center"
    padding "large"
  }
  heading "Hello, World"
  text "Welcome to my site."
}
Background tokens: dark light primary secondary accent success warning danger muted neutral
Padding tokens: none small medium large xlarge
All Elements
originDownloadCopy codeheading "Title"
text "Paragraph content."
button "Click Me" -> "#target"
button "Submit" -> handleSubmit
image "photo.jpg" "Alt description"
link "Label" -> "https://example.com"
icon "search"
divider
spacer "large"
list {
  item "First entry"
  item "Second entry"
}
Navigation
originDownloadCopy codenav {
  link "Home" -> "/"
  link "About" -> "/about"
  button "Sign Up" -> "/signup"
}
Generates a responsive navbar with mobile hamburger toggle, keyboard accessibility, and ARIA attributes.
Grids and Cards
originDownloadCopy codegrid 3 {
  card {
    heading "Feature"
    text "Description here."
  }
}
Compiles to CSS Grid with hover effects and responsive reflow on mobile.
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
Includes overlay, close button, escape-key dismissal, ARIA dialog attributes, and scroll locking.
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
Access and modify state in the browser via window.originState.
Comments
originDownloadCopy code// Single-line comment
/* Multi-line comment */

Origin Sense — Semantic Intent Engine
Origin Sense is the feature that differentiates Origin from every other web toolchain. It is a semantic analysis layer built into the compiler that understands what you are building and applies intelligent optimizations automatically.
What It Does
CategoryAutomatic BehaviorAccessibilityARIA roles from section names, heading hierarchy, alt text inference, focus managementSEOTitle inference, meta descriptions, Open Graph tags, semantic HTMLPerformanceImage lazy loading, async decoding, conditional JS emission, minimal CSSSecurityExternal links get rel="noopener noreferrer", forms use novalidate
Section Intent Detection
Section NameApplied Role & Labelherorole="banner"aboutaria-label="About section"featuresaria-label="Features section"pricingaria-label="Pricing section"contactaria-label="Contact section"faqaria-label="Frequently asked questions"testimonialsaria-label="Testimonials"teamaria-label="Team members"galleryaria-label="Image gallery"servicesaria-label="Our services"blogaria-label="Blog posts"portfolioaria-label="Portfolio"
Sense Reports
Every build produces a report in the terminal:
Warnings for index:
  - Page "Home": missing title. Inferred "Home".
  - Image "photo.jpg": missing alt text. Inferred "Photo".
Build complete: 1 file(s) compiled, 2 warning(s).


Architecture
.origin file
    │
    ▼
  Lexer ────► Token Stream
    │
    ▼
  Parser ───► AST
    │
    ▼
  Sense ────► Enriched AST + Report
    │
    ▼
  Generator ► index.html + index.css + index.js (conditional)

Lexer — Tokenizes source code. Handles comments, escape sequences, tracks line/column numbers.
Parser — Recursive descent parser. Produces an Abstract Syntax Tree with clear error messages.
Sense — Semantic analysis. Enriches the AST with accessibility, SEO, performance, and security metadata.
Generators — Three generators produce HTML, CSS, and JS. The JS generator only emits a file when interactive features are present. A static page produces zero JavaScript.

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
CommandDescriptionorigin create <name>Create a new project with starter filesorigin buildCompile all .origin files to dist/origin serveBuild and start local server on port 3000origin helpShow available commands

Project Structure
origin/
├── package.json
├── LICENSE
├── README.md
├── CONTRIBUTING.md
├── cli/
│   └── index.js
├── compiler/
│   ├── index.js
│   ├── lexer/
│   │   └── index.js
│   ├── parser/
│   │   └── index.js
│   ├── ast/
│   │   └── nodes.js
│   ├── generator/
│   │   ├── index.js
│   │   ├── html.js
│   │   ├── css.js
│   │   └── js.js
│   └── sense/
│       └── index.js
├── examples/
│   ├── landing.origin
│   ├── blog.origin
│   └── api-dashboard.origin
└── tests/
    └── run.js


Roadmap
VersionMilestonev0.1Core lexer, parser, HTML generationv0.2Grids, cards, forms, lists, modals, CSS generationv0.3JS generation, navigation, modals, forms, state, API fetchv0.5Full Origin Sense semantic analysis enginev1.0Production-ready compiler, complete docs and test suiteFutureCustom theming, multi-page routing, SSR, plugins, VS Code extension

FAQ
Is Origin a framework?
No. Origin is a compiled language. It produces static HTML, CSS, and JavaScript files.
Does Origin replace React/Vue/Svelte?
Origin targets websites, landing pages, and content-driven applications. For complex SPAs with heavy client-side state, a framework may be more appropriate.
Can I use custom CSS or JavaScript?
Yes. The generated output is standard and can be extended. JavaScript dispatches custom events (origin:form-submit, origin:action, origin:fetch-complete) that you can listen for in your own scripts.
Does Origin have dependencies?
Zero runtime dependencies. It runs on Node.js using only built-in modules.
How fast is compilation?
A typical page compiles in under 10 milliseconds.
Can I deploy the output anywhere?
Yes. Static files that work on any hosting provider, CDN, or local server.

Running Tests
bashDownloadCopy codenpm test

Contributing
See CONTRIBUTING.md for guidelines.

License
MIT — see LICENSE for details.

"Reminder That This Is A Solo Project By Students. Expect More Than 5 Bugs If possible. Next Update: Multi-Paging And Rutes."
