# Contributing to Origin

Thank you for your interest in contributing to Origin.

## Getting Started

1. Fork the repository.
2. Clone your fork locally.
3. Create a new branch for your work.
4. Make your changes.
5. Run the test suite with `npm test`.
6. Submit a pull request.

## Development Setup

```bash
git clone https://github.com/your-username/origin.git
cd origin
npm test
```

## Project Structure
compiler/          Core compiler pipeline
lexer/           Tokenizer
parser/          Recursive descent parser
ast/             AST node definitions
generator/       HTML, CSS, JS code generators
sense/           Origin Sense semantic engine
cli/               Command-line interface
examples/          Example .origin files
tests/             Test suite
docs/              Documentation. 

## What to Work On

- Bug fixes and error handling improvements
- New language features (propose in an issue first)
- Compiler optimizations
- Documentation improvements
- Additional test cases
- New examples

## Code Style

- Use clear, descriptive variable names.
- Keep functions focused on a single responsibility.
- Add test coverage for new features.
- Do not introduce external dependencies without discussion.

- ## Pull Request Guidelines

- Describe what your PR changes and why.
- Reference any related issues.
- Ensure all tests pass before submitting.
- Keep PRs focused. One feature or fix per PR.

## Reporting Bugs

Open an issue with a clear title, a description of the expected vs. actual behavior, and a minimal `.origin` file that reproduces the problem.
