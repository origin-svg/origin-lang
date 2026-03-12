#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { OriginCompiler } = require("../compiler");

const args = process.argv.slice(2);
const command = args[0];

const HELP = `
  Origin CLI v0.1.0

  Usage:
    origin create <name>     Create a new project
    origin build             Compile .origin files to dist/
    origin serve             Build and start local server
    origin help              Show this message
`;

function create(name) {
  if (!name) {
    console.error("Error: project name required.");
    process.exit(1);
  }

  const dir = path.resolve(process.cwd(), name);

  if (fs.existsSync(dir)) {
    console.error(`Error: directory "${name}" already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(path.join(dir, "src"));
  fs.mkdirSync(path.join(dir, "dist"));

  const defaultPage = `page Home {

  title "Welcome to ${name}"
  description "Built with Origin"

  section hero {
    style {
      background "dark"
      align "center"
      padding "large"
    }

    heading "Welcome to ${name}"
    text "A modern website built with Origin Script."
    button "Get Started" -> "#about"
  }

  section about {
    style {
      padding "medium"
    }

    heading "About"
    text "This project was generated with Origin CLI."
  }

  footer {
    text "Built with Origin"
  }
}
`;

  const config = `{
  "name": "${name}",
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
`;

  fs.writeFileSync(path.join(dir, "src", "index.origin"), defaultPage);
  fs.writeFileSync(path.join(dir, "origin.config.json"), config);
  fs.writeFileSync(
    path.join(dir, ".gitignore"),
    "node_modules/\ndist/\n.DS_Store\n"
  );

  console.log(`Project "${name}" created.`);
  console.log(`  cd ${name}`);
  console.log(`  origin build`);
  console.log(`  origin serve`);
}

function loadConfig() {
  const configPath = path.resolve(process.cwd(), "origin.config.json");
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
  return {
    name: "origin-project",
    entry: "src/index.origin",
    output: "dist",
    sense: {
      accessibility: true,
      seo: true,
      performance: true,
      responsive: true,
      security: true,
    },
  };
}

function findOriginFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findOriginFiles(full));
    } else if (entry.name.endsWith(".origin")) {
      results.push(full);
    }
  }
  return results;
}

function build() {
  const config = loadConfig();
  const srcDir = path.resolve(process.cwd(), path.dirname(config.entry));
  const outDir = path.resolve(process.cwd(), config.output);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const files = findOriginFiles(srcDir);

  if (files.length === 0) {
    console.error("No .origin files found.");
    process.exit(1);
  }

  const compiler = new OriginCompiler(config.sense || {});
  let compiled = 0;
  let warnings = 0;

  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8");
    const baseName = path.basename(file, ".origin");

    try {
      const result = compiler.compile(source);

      fs.writeFileSync(path.join(outDir, `${baseName}.html`), result.html);

      if (result.css && result.css.trim().length > 0) {
        fs.writeFileSync(path.join(outDir, `${baseName}.css`), result.css);
      }

      if (result.js && result.js.trim().length > 0) {
        fs.writeFileSync(path.join(outDir, `${baseName}.js`), result.js);
      }

      compiled++;
      warnings += result.report ? result.report.warnings.length : 0;

      if (result.report && result.report.warnings.length > 0) {
        console.log(`  Warnings for ${baseName}:`);
        for (const w of result.report.warnings) {
          console.log(`    - ${w}`);
        }
      }
    } catch (err) {
      console.error(`Error compiling ${file}: ${err.message}`);
    }
  }

  console.log(
    `Build complete: ${compiled} file(s) compiled, ${warnings} warning(s).`
  );
}

function serve() {
  build();

  const config = loadConfig();
  const outDir = path.resolve(process.cwd(), config.output);
  const http = require("http");
  const port = 3000;

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(outDir, req.url === "/" ? "index.html" : req.url);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });

  server.listen(port, () => {
    console.log(`Origin server running at http://localhost:${port}`);
  });
}

switch (command) {
  case "create":
    create(args[1]);
    break;
  case "build":
    build();
    break;
  case "serve":
    serve();
    break;
  case "help":
  default:
    console.log(HELP);
}
