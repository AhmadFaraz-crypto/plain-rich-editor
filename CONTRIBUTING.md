# Contributing to Rich Editor

Thank you for your interest in contributing to Rich Editor! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different opinions and approaches

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

### Development Setup

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/editor.git
   cd editor
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start watching for changes**
   ```bash
   npm run watch
   ```

## 📁 Project Structure

Understanding the project structure helps you contribute effectively:

```
src/
├── components/        # UI Components (React-like pattern)
│   ├── RichEditor.ts      # Main orchestrator
│   ├── EditorContent.ts   # Content area
│   └── toolbar/          # Toolbar sub-components
├── core/             # Core business logic (framework-agnostic)
│   ├── EditorEngine.ts
│   └── SelectionManager.ts
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── styles/           # SCSS stylesheets
└── index.ts          # Public API entry point
```

### Component Guidelines

- **One class per file**: Each component/class should be in its own file
- **Clear responsibilities**: Each component should have a single, well-defined purpose
- **Dependency injection**: Pass dependencies through constructor or methods
- **Type safety**: Use TypeScript types for all public APIs

### File Naming Conventions

- **Components/Classes**: PascalCase (`RichEditor.ts`, `ToolbarButton.ts`)
- **Utilities**: camelCase (`dom.ts`, `constants.ts`)
- **Types**: camelCase with `.types.ts` suffix (`editor.types.ts`)
- **Styles**: kebab-case (`editor.scss`, `toolbar.scss`)

## 📝 Coding Standards

### TypeScript

- Use **strict mode** (enabled in tsconfig.json)
- Define types for all function parameters and return values
- Use interfaces for object shapes
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Add JSDoc comments for public APIs

**Example:**
```typescript
/**
 * Applies formatting to the selected text
 * @param format - The format to apply (bold, underline, etc.)
 * @returns true if formatting was applied successfully
 */
public applyFormat(format: TextFormat): boolean {
  // Implementation
}
```

### SCSS

- Use variables from `variables.scss` for design tokens
- Use mixins from `mixins.scss` for reusable patterns
- Follow BEM methodology for complex components
- Keep selectors shallow (max 3 levels)
- Use meaningful class names

**Example:**
```scss
.editor-button {
  @include button-base;
  
  &--primary {
    background: $color-primary;
  }
  
  &--disabled {
    @include button-disabled;
  }
}
```

### Code Organization

1. **Imports**: Group by type
   ```typescript
   // 1. External libraries
   import { SomeLib } from 'some-lib';
   
   // 2. Internal types
   import type { EditorState } from '../types/editor.types.js';
   
   // 3. Internal components/utils
   import { Toolbar } from './toolbar/Toolbar.js';
   ```

2. **Class structure**:
   ```typescript
   export class MyComponent {
     // 1. Private properties
     private prop: string;
     
     // 2. Constructor
     constructor() {}
     
     // 3. Public methods
     public method() {}
     
     // 4. Private methods
     private helper() {}
   }
   ```

## 🔧 Development Guidelines

### Adding a New Feature

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Follow the architecture**
   - UI components → `src/components/`
   - Business logic → `src/core/`
   - Utilities → `src/utils/`
   - Types → `src/types/`

3. **Update documentation**
   - Update README.md if needed
   - Add JSDoc comments
   - Update API documentation

4. **Test your changes**
   - Test in different browsers
   - Test edge cases
   - Ensure no regressions

### Adding New Toolbar Button

1. Create button component in `src/components/toolbar/`
2. Add to `Toolbar.ts` initialization
3. Add styles in `src/styles/toolbar.scss`
4. Update constants if needed (`src/utils/constants.ts`)

### Modifying Core Logic

1. Update files in `src/core/`
2. Ensure backward compatibility
3. Update types if needed
4. Test thoroughly

## 📤 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(toolbar): add font color picker
fix(selection): prevent selection loss on blur
docs(readme): update installation instructions
refactor(core): simplify EditorEngine logic
```

## 🔍 Pull Request Process

1. **Update your branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout feature/my-feature
   git rebase main
   ```

2. **Ensure code quality**
   - Code follows style guidelines
   - TypeScript compiles without errors
   - All tests pass (when available)
   - Documentation is updated

3. **Create Pull Request**
   - Clear title and description
   - Reference related issues
   - Add screenshots for UI changes
   - List all changes made

4. **Review Process**
   - Address review comments
   - Update PR if needed
   - Wait for approval

## 🐛 Reporting Bugs

### Before Reporting

- Check if the issue already exists
- Verify it's reproducible
- Try the latest version

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. ...
2. ...

**Expected behavior**
What you expected to happen.

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Editor version: [e.g., 1.0.0]

**Screenshots**
If applicable, add screenshots.

**Additional context**
Any other relevant information.
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other relevant information or examples.
```

## 📚 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Questions?

If you have questions or need help:

1. Check existing issues and PRs
2. Open a new issue with the `question` label
3. Review the codebase for examples

Thank you for contributing to Rich Editor! 🎉

