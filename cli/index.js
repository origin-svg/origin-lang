#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const command = process.argv[2];
const target = process.argv[3];

if (command === "build") {
  if (!target) {
    console.log("Usage: origin build <file.origin>");
    process.exit(1);
  }

  const filePath = path.resolve(target);

  if (!fs.existsSync(filePath)) {
    console.log("File not found:", filePath);
    process.exit(1);
  }

  console.log("Compiling:", filePath);

  const source = fs.readFileSync(filePath, "utf-8");

  try {
    const { OriginCompiler } = require("../compiler");
    const compiler = new OriginCompiler();
    const result = compiler.compile(source);

    const outDir = path.resolve("dist");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(path.join(outDir, "index.html"), result.html);
    fs.writeFileSync(path.join(outDir, "styles.css"), result.css);
    fs.writeFileSync(path.join(outDir, "main.js"), result.js);

    console.log("Build successful! Output in /dist");
  } catch (err) {
    console.log("Error:", err.message);
    console.log(err.stack);
  }
} else {
  console.log("Commands: build <file.origin>");
}
