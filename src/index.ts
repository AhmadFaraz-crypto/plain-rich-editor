/**
 * @packageDocumentation
 *
 * # Rich Editor
 *
 * A modern, lightweight rich text editor built with plain TypeScript.
 * Zero external dependencies for core functionality.
 *
 * ## Installation
 *
 * ```bash
 * npm install word-editor
 * ```
 *
 * ## Basic Usage
 *
 * ```typescript
 * import { RichEditor } from 'word-editor';
 * import 'word-editor/dist/styles/editor.css';
 *
 * const container = document.getElementById('editor');
 * const editor = new RichEditor(container);
 * editor.render();
 * ```
 *
 * @module RichEditor
 */

import { RichEditor } from './components/RichEditor.js';

// Main export
export { RichEditor };

// Type exports
export * from './types/editor.types.js';

// Core exports (for advanced usage)
export * from './core/EditorEngine.js';
export * from './core/SelectionManager.js';

// Extension system exports
export * from './core/Extension.js';
export * from './core/ExtensionManager.js';

