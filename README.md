# Rich Editor

A modern, lightweight rich text editor built with plain TypeScript. Zero external dependencies for core functionality, fully customizable, and designed for both developers and contributors.

## Features

- **Rich Text Formatting**: Bold, italic, underline formatting with font family support
- **HTML Preview**: Toggle between editor, preview, and both views
- **Style Dropdown**: Heading styles (H1-H6) and normal text
- **Keyboard Shortcuts**: Full keyboard support
- **Modular Architecture**: Clean, maintainable code structure
- **TypeScript**: Fully typed for better developer experience
- **Zero Dependencies**: Core functionality has no external dependencies
- **SCSS Styling**: Customizable with SCSS variables
- **Responsive Design**: Works on all screen sizes

## Installation

```bash
npm install plain-rich-editor
```

## Quick Start

### Framework Compatibility

`plain-rich-editor` is a vanilla TypeScript package that works with any JavaScript framework or vanilla JavaScript. It can be used in:

- **Vanilla JavaScript/TypeScript** (Browser)
- **React** (16.8+)
- **Vue.js** (2.x and 3.x)
- **Angular** (9+)
- **Next.js** (with SSR considerations)
- **Svelte** (3+)
- **Any framework** that can render DOM elements

### Basic Usage (Vanilla JavaScript)

```typescript
import { RichEditor } from 'plain-rich-editor';
import 'plain-rich-editor/dist/styles/editor.css';

const container = document.getElementById('editor');
const editor = new RichEditor(container, {
  initialContent: '<p>Hello World</p>',
  onContentChange: (content) => console.log(content),
});
editor.render();
```

### HTML Example

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/plain-rich-editor/dist/styles/editor.css">
</head>
<body>
  <div id="editor-root"></div>
  
  <script type="module">
    import { RichEditor } from 'node_modules/plain-rich-editor/dist/index.js';
    const editor = new RichEditor(document.getElementById('editor-root'));
    editor.render();
  </script>
</body>
</html>
```

## Configuration Options

The `RichEditor` constructor accepts an optional `RichEditorOptions` object to configure the editor behavior and appearance.

### RichEditorOptions

```typescript
interface RichEditorOptions {
  // Content options
  initialContent?: string;              // Initial HTML content
  readonly?: boolean;                    // Enable readonly mode

  // Callbacks
  onContentChange?: (content: string) => void;           // Called when content changes
  onFormatChange?: (format: TextFormat) => void;        // Called when format changes
  onSelectionChange?: (range: EditorRange | null) => void; // Called when selection changes

  // View options
  showHtmlPreview?: boolean;            // Show HTML preview toggle
  initialViewMode?: 'editor' | 'preview' | 'both'; // Initial view mode

  // Extensions
  extensions?: Extension[];            // Array of extensions/plugins

  // Toolbar configuration
  toolbar?: ToolbarOptions;             // Toolbar customization
}
```

### Option Details

#### Content Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialContent` | `string` | `''` | Initial HTML content to load into the editor |
| `readonly` | `boolean` | `false` | If `true`, the editor becomes read-only |

#### Callback Functions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onContentChange` | `(content: string) => void` | `undefined` | Called whenever the editor content changes. Receives the current HTML content. |
| `onFormatChange` | `(format: TextFormat) => void` | `undefined` | Called when text formatting changes (e.g., bold, italic, font). Receives the current format state. |
| `onSelectionChange` | `(range: EditorRange \| null) => void` | `undefined` | Called when the text selection changes. Receives the selection range or `null` if no selection. |

**TextFormat Interface:**
```typescript
interface TextFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontFamily?: string;
}
```

> **Note**: The `TextFormat` interface is returned by the `onFormatChange` callback. Only properties with UI controls are listed above. Additional properties may exist in the type system for internal use but are not user-configurable through the toolbar.

**EditorRange Interface:**
```typescript
interface EditorRange {
  start: number;  // Start position
  end: number;    // End position
}
```

#### View Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showHtmlPreview` | `boolean` | `true` | Whether to show the view mode buttons (Editor, Preview, Both). If `false`, all three buttons are hidden |
| `initialViewMode` | `'editor' \| 'preview' \| 'both'` | `'editor'` | Initial view mode when editor loads. Sets which button is active initially |

**View Mode Buttons:**
- **Editor**: Shows only the editor view (default)
- **Preview**: Shows only the HTML preview
- **Both**: Shows editor and preview side-by-side

All three buttons are controlled by `showHtmlPreview`. If set to `false`, none of the view mode buttons will be shown.

#### Extensions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `extensions` | `Extension[]` | `[]` | Array of extension/plugin objects to extend editor functionality |

### ToolbarOptions

```typescript
interface ToolbarOptions {
  // Show/hide toolbar groups
  showFormatButtons?: boolean;          // Show Bold, Italic, Underline buttons
  showFontFamily?: boolean;             // Show font family dropdown
  showStyleDropdown?: boolean;           // Show style dropdown (headings)

  // Format buttons configuration
  formatButtons?: {
    bold?: boolean;                     // Show/hide Bold button
    italic?: boolean;                   // Show/hide Italic button
    underline?: boolean;                 // Show/hide Underline button
  };
}
```

#### Toolbar Option Details

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showFormatButtons` | `boolean` | `true` | Show/hide the entire format buttons group (Bold, Italic, Underline). If `false`, all format buttons are hidden |
| `formatButtons` | `object` | `undefined` | Fine-grained control over individual format buttons. Only applies when `showFormatButtons` is `true` |
| `formatButtons.bold` | `boolean` | `true` | Show/hide Bold button individually |
| `formatButtons.italic` | `boolean` | `true` | Show/hide Italic button individually |
| `formatButtons.underline` | `boolean` | `true` | Show/hide Underline button individually |
| `showFontFamily` | `boolean` | `true` | Show/hide the font family dropdown |
| `showStyleDropdown` | `boolean` | `true` | Show/hide the style dropdown (Normal, H1, H2, etc.) |

**Format Buttons Control:**
- Set `showFormatButtons: false` to hide all format buttons (Bold, Italic, Underline)
- Set `showFormatButtons: true` and use `formatButtons` object to show/hide individual buttons:
  ```typescript
  toolbar: {
    showFormatButtons: true,  // Show format buttons group
    formatButtons: {
      bold: true,      // Show Bold
      italic: false,   // Hide Italic
      underline: true  // Show Underline
    }
  }
  ```

### Usage Examples

#### Basic Configuration

```typescript
const editor = new RichEditor(container, {
  initialContent: '<p>Hello World</p>',
  onContentChange: (content) => {
    console.log('Content changed:', content);
  },
});
editor.render();
```

#### Readonly Mode

```typescript
const editor = new RichEditor(container, {
  initialContent: '<p>This is read-only content</p>',
  readonly: true,
});
editor.render();
```

#### Custom Toolbar Configuration

```typescript
const editor = new RichEditor(container, {
  toolbar: {
    showFormatButtons: true,
    formatButtons: {
      bold: true,
      italic: true,
      underline: false,  // Hide underline button individually
    },
    showFontFamily: true,
    showStyleDropdown: false,  // Hide style dropdown
  },
  showHtmlPreview: true,  // Show view mode buttons (Editor, Preview, Both)
  initialViewMode: 'both',  // Start with both views visible
});
editor.render();
```

#### Minimal Toolbar (Only Format Buttons)

```typescript
const editor = new RichEditor(container, {
  toolbar: {
    showFormatButtons: true,
    showFontFamily: false,
    showStyleDropdown: false,
  },
});
editor.render();
```

#### With View Mode Configuration

```typescript
const editor = new RichEditor(container, {
  showHtmlPreview: true,  // Show view mode buttons (Editor, Preview, Both)
  initialViewMode: 'both',  // Start with both editor and preview visible
});
editor.render();
```

**Hide View Mode Buttons:**
```typescript
const editor = new RichEditor(container, {
  showHtmlPreview: false,  // Hide Editor, Preview, Both buttons completely
});
editor.render();
```

#### With All Callbacks

```typescript
const editor = new RichEditor(container, {
  onContentChange: (content) => {
    console.log('Content:', content);
    // Save to server, update state, etc.
  },
  onFormatChange: (format) => {
    console.log('Format:', format);
    // Update UI, show format info, etc.
  },
  onSelectionChange: (range) => {
    console.log('Selection:', range);
    // Show selection info, enable/disable buttons, etc.
  },
});
editor.render();
```

## Framework-Specific Usage

### React

```typescript
import React, { useEffect, useRef } from 'react';
import { RichEditor } from 'plain-rich-editor';
import type { RichEditorOptions } from 'plain-rich-editor';
import 'plain-rich-editor/dist/styles/editor.css';

interface RichEditorComponentProps {
  options?: RichEditorOptions;
  onContentChange?: (content: string) => void;
}

const RichEditorComponent: React.FC<RichEditorComponentProps> = ({ 
  options = {}, 
  onContentChange 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<RichEditor | null>(null);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const editorOptions: RichEditorOptions = {
        ...options,
        onContentChange: onContentChange || options.onContentChange,
      };
      
      editorRef.current = new RichEditor(containerRef.current, editorOptions);
      editorRef.current.render();
    }

    // Cleanup on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Update content when options.initialContent changes
  useEffect(() => {
    if (editorRef.current && options.initialContent !== undefined) {
      editorRef.current.setContent(options.initialContent);
    }
  }, [options.initialContent]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default RichEditorComponent;
```

**Usage:**
```tsx
import RichEditorComponent from './RichEditorComponent';

function App() {
  const handleContentChange = (content: string) => {
    console.log('Content changed:', content);
  };

  return (
    <div style={{ padding: '20px' }}>
      <RichEditorComponent
        options={{
          toolbar: {
            showFormatButtons: true,
            showFontFamily: true,
          },
        }}
        onContentChange={handleContentChange}
      />
    </div>
  );
}
```

### Vue.js (Composition API - Vue 3)

```vue
<template>
  <div ref="editorContainer" style="width: 100%; height: 100%;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { RichEditor } from 'plain-rich-editor';
import type { RichEditorOptions } from 'plain-rich-editor';
import 'plain-rich-editor/dist/styles/editor.css';

interface Props {
  options?: RichEditorOptions;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
});

const emit = defineEmits<{
  (e: 'content-change', content: string): void;
  (e: 'format-change', format: any): void;
}>();

const editorContainer = ref<HTMLDivElement | null>(null);
let editorInstance: RichEditor | null = null;

onMounted(() => {
  if (editorContainer.value) {
    const editorOptions: RichEditorOptions = {
      ...props.options,
      onContentChange: (content) => emit('content-change', content),
      onFormatChange: (format) => emit('format-change', format),
    };
    
    editorInstance = new RichEditor(editorContainer.value, editorOptions);
    editorInstance.render();
  }
});

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.destroy();
    editorInstance = null;
  }
});

watch(() => props.options?.initialContent, (newContent) => {
  if (editorInstance && newContent !== undefined) {
    editorInstance.setContent(newContent);
  }
});
</script>
```

**Usage:**
```vue
<template>
  <RichEditorComponent
    :options="{
      toolbar: {
        showFormatButtons: true,
      },
    }"
    @content-change="handleContentChange"
  />
</template>

<script setup lang="ts">
import RichEditorComponent from './RichEditorComponent.vue';

const handleContentChange = (content: string) => {
  console.log('Content changed:', content);
};
</script>
```

### Vue.js (Options API - Vue 2)

```vue
<template>
  <div ref="editorContainer" style="width: 100%; height: 100%;"></div>
</template>

<script>
import { RichEditor } from 'plain-rich-editor';
import 'plain-rich-editor/dist/styles/editor.css';

export default {
  name: 'RichEditorComponent',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    if (this.$refs.editorContainer) {
      this.editor = new RichEditor(this.$refs.editorContainer, {
        ...this.options,
        onContentChange: (content) => this.$emit('content-change', content),
      });
      this.editor.render();
    }
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  },
  watch: {
    'options.initialContent': {
      handler(newContent) {
        if (this.editor && newContent !== undefined) {
          this.editor.setContent(newContent);
        }
      },
    },
  },
  data() {
    return {
      editor: null,
    };
  },
};
</script>
```

### Angular

```typescript
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RichEditor } from 'plain-rich-editor';
import type { RichEditorOptions } from 'plain-rich-editor';
import 'plain-rich-editor/dist/styles/editor.css';

@Component({
  selector: 'app-rich-editor',
  template: '<div #editorContainer style="width: 100%; height: 100%;"></div>',
  styles: [':host { display: block; width: 100%; height: 100%; }']
})
export class RichEditorComponent implements OnInit, OnDestroy {
  @Input() options: RichEditorOptions = {};
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef<HTMLDivElement>;

  private editorInstance: RichEditor | null = null;

  ngOnInit(): void {
    if (this.editorContainer?.nativeElement) {
      this.editorInstance = new RichEditor(
        this.editorContainer.nativeElement,
        this.options
      );
      this.editorInstance.render();
    }
  }

  ngOnDestroy(): void {
    if (this.editorInstance) {
      this.editorInstance.destroy();
      this.editorInstance = null;
    }
  }

  getContent(): string {
    return this.editorInstance?.getContent() || '';
  }

  setContent(content: string): void {
    if (this.editorInstance) {
      this.editorInstance.setContent(content);
    }
  }
}
```

**Usage:**
```html
<app-rich-editor
  [options]="{
    toolbar: {
      showFormatButtons: true,
    }
  }"
></app-rich-editor>
```

### Next.js (with SSR)

```typescript
'use client'; // Required for Next.js 13+ App Router

import { useEffect, useRef } from 'react';
import { RichEditor } from 'plain-rich-editor';
import type { RichEditorOptions } from 'plain-rich-editor';
import 'plain-rich-editor/dist/styles/editor.css';

interface RichEditorProps {
  options?: RichEditorOptions;
}

export default function RichEditorClient({ options = {} }: RichEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<RichEditor | null>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined' && containerRef.current && !editorRef.current) {
      editorRef.current = new RichEditor(containerRef.current, options);
      editorRef.current.render();
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && options.initialContent !== undefined) {
      editorRef.current.setContent(options.initialContent);
    }
  }, [options.initialContent]);

  return <div ref={containerRef} style={{ width: '100%', minHeight: '400px' }} />;
}
```

### Svelte

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { RichEditor } from 'plain-rich-editor';
  import type { RichEditorOptions } from 'plain-rich-editor';
  import 'plain-rich-editor/dist/styles/editor.css';

  export let options: RichEditorOptions = {};

  let editorContainer: HTMLDivElement;
  let editorInstance: RichEditor | null = null;

  onMount(() => {
    if (editorContainer) {
      editorInstance = new RichEditor(editorContainer, options);
      editorInstance.render();
    }
  });

  onDestroy(() => {
    if (editorInstance) {
      editorInstance.destroy();
      editorInstance = null;
    }
  });

  export function getContent(): string {
    return editorInstance?.getContent() || '';
  }

  export function setContent(content: string): void {
    if (editorInstance) {
      editorInstance.setContent(content);
    }
  }
</script>

<div bind:this={editorContainer} style="width: 100%; height: 100%;"></div>
```

**Usage:**
```svelte
<script>
  import RichEditor from './RichEditor.svelte';
  
  let editor;

  function handleContentChange() {
    console.log('Content:', editor.getContent());
  }
</script>

<RichEditor 
  bind:this={editor}
  options={{
    toolbar: {
      showFormatButtons: true,
    },
  }}
  on:content-change={handleContentChange}
/>
```

## API Documentation

### RichEditor Class

Main editor class that orchestrates all components.

#### Constructor

```typescript
constructor(container: HTMLElement, options?: RichEditorOptions)
```

Creates a new editor instance.

**Parameters:**
- `container` (required): The HTML element that will contain the editor
- `options` (optional): Configuration options (see [Configuration Options](#-configuration-options-props))

**Example:**
```typescript
const container = document.getElementById('editor');
const editor = new RichEditor(container, {
  initialContent: '<p>Hello World</p>',
  onContentChange: (content) => console.log(content),
});
```

#### Methods

##### `render(): void`

Initializes and renders the editor. This must be called after creating a new `RichEditor` instance.

**Example:**
```typescript
const editor = new RichEditor(container, options);
editor.render(); // Must call render() to display the editor
```

---

##### `focus(): void`

Focuses the editor content area, placing the cursor in the editor.

**Example:**
```typescript
editor.focus();
```

---

##### `getContent(): string`

Returns the current HTML content of the editor.

**Returns:** The HTML content as a string

**Example:**
```typescript
const content = editor.getContent();
console.log(content); // '<p>Hello World</p>'
```

---

##### `setContent(html: string): void`

Sets the editor content from HTML.

**Parameters:**
- `html` (required): HTML string to set as editor content

**Example:**
```typescript
editor.setContent('<p>New content</p>');
```

---

##### `destroy(): void`

Destroys the editor instance, removing all event listeners and cleaning up resources. Should be called when removing the editor from the DOM (especially in React, Vue, etc.).

**Example:**
```typescript
// In React useEffect cleanup
useEffect(() => {
  const editor = new RichEditor(containerRef.current, options);
  editor.render();
  
  return () => {
    editor.destroy(); // Cleanup
  };
}, []);
```

---

##### `setViewMode(mode: 'editor' | 'preview' | 'both'): void`

Changes the current view mode of the editor.

**Parameters:**
- `mode` (required): The view mode to set
  - `'editor'`: Show only the editor
  - `'preview'`: Show only the HTML preview
  - `'both'`: Show both editor and preview side-by-side

**Example:**
```typescript
editor.setViewMode('both'); // Show both views
editor.setViewMode('preview'); // Switch to preview only
```

---

##### `registerExtension(extension: Extension): void`

Registers an extension/plugin with the editor. (Advanced usage)

**Parameters:**
- `extension` (required): Extension object implementing the `Extension` interface

**Example:**
```typescript
const myExtension = {
  name: 'my-extension',
  // ... extension implementation
};
editor.registerExtension(myExtension);
```

---

##### `unregisterExtension(extensionName: string): void`

Unregisters an extension from the editor. (Advanced usage)

**Parameters:**
- `extensionName` (required): Name of the extension to remove

**Example:**
```typescript
editor.unregisterExtension('my-extension');
```

---

## For Contributors

### Project Structure

```
src/
├── components/          # UI Components
│   ├── RichEditor.ts   # Main editor component
│   ├── EditorContent.ts # Content area component
│   └── toolbar/        # Toolbar components
│       ├── Toolbar.ts
│       ├── FormatButtons.ts
│       ├── FontControls.ts
│       └── ...
├── core/               # Core logic
│   ├── EditorEngine.ts      # Text manipulation & formatting
│   └── SelectionManager.ts  # Selection & cursor management
├── types/              # TypeScript types
│   └── editor.types.ts
├── utils/              # Utility functions
│   ├── HtmlConverter.ts    # HTML conversion utilities
│   ├── dom.ts              # DOM helpers
│   └── constants.ts        # Constants
├── styles/             # SCSS stylesheets
│   ├── editor.scss
│   ├── toolbar.scss
│   ├── variables.scss
│   └── mixins.scss
└── index.ts           # Main entry point
```

### Development Setup

> **Note**: This section is for developers contributing to the package. If you're just using the package, you can skip to [License](#license) and [Support](#support).

```bash
# Clone the repository
git clone <repository-url>
cd editor

# Install dependencies
npm install

# Build the project
npm run build
```

### Watch Mode

```bash
# Watch for changes and auto-compile
npm run watch
```

### Production Builds

The project includes options to minify and obfuscate code for production:

```bash
# Build with minification (recommended for production)
npm run build:prod

# Build with obfuscation (maximum protection, may impact performance)
npm run build:secure

# Or run minification/obfuscation separately
npm run minify
npm run obfuscate
```

**Note:**
- **`build:prod`** - Minifies code using terser (reduces file size, harder to read)
- **`build:secure`** - Obfuscates code using javascript-obfuscator (very hard to read, but may slow down execution)
- Minification is recommended for most production builds
- Obfuscation provides stronger protection but adds overhead

### Project Structure Guidelines

1. **Components** (`src/components/`): All UI components
   - One component per file
   - PascalCase naming for classes
   - Clear separation of concerns

2. **Core** (`src/core/`): Core business logic
   - No UI dependencies
   - Pure TypeScript logic

3. **Types** (`src/types/`): TypeScript type definitions
   - All shared types in one place

4. **Utils** (`src/utils/`): Utility functions
   - Reusable helper functions
   - No business logic

5. **Styles** (`src/styles/`): SCSS stylesheets
   - Variables for design tokens
   - Mixins for reusable patterns
   - Component-specific styles

## Customization

### SCSS Variables

Customize the editor appearance by overriding SCSS variables:

```scss
// Your custom styles
@use 'plain-rich-editor/dist/styles/variables' as *;

:root {
  --color-primary: #your-color;
  --toolbar-height: 40px;
}
```

### Styling

The editor uses CSS classes that you can override:

- `.rich-editor` - Main container
- `.editor-toolbar-container` - Toolbar
- `.editor-content` - Content area

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the code structure guidelines
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Style

- **TypeScript**: Strict mode enabled
- **Naming**: PascalCase for classes, camelCase for functions/variables
- **File Structure**: One class/component per file
- **Comments**: JSDoc comments for public APIs
- **SCSS**: Use variables and mixins, follow BEM methodology where appropriate

## Testing

```bash
# Run tests (when available)
npm test
```

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built with modern web technologies, designed for developers who want full control over their editor implementation.

## Support

- Open an issue on GitHub for bug reports
- See CONTRIBUTING.md for contribution guidelines
