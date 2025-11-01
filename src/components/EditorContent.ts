/**
 * Editor content area component - renders and manages the editable content
 */

import type { EditorState } from '../types/editor.types.js';
import { ContentRenderer } from './content/Renderer.js';
import { CursorManager } from './content/CursorManager.js';

export class EditorContent {
  private container: HTMLElement;
  private renderer: ContentRenderer;
  private cursorManager: CursorManager;
  private onInput: (text: string) => void;
  private onKeyDown: (event: KeyboardEvent) => void;
  private onPaste: (content: string, isHtml: boolean) => void;

  constructor(
    container: HTMLElement,
    onInput: (text: string) => void,
    onKeyDown: (event: KeyboardEvent) => void,
    onPaste: (content: string, isHtml: boolean) => void,
  ) {
    this.container = container;
    this.renderer = new ContentRenderer();
    this.cursorManager = new CursorManager(container);
    this.onInput = onInput;
    this.onKeyDown = onKeyDown;
    this.onPaste = onPaste;
    this.initialize();
  }

  private initialize(): void {
    this.container.className = 'editor-content';
    this.container.setAttribute('contenteditable', 'true');
    this.container.setAttribute('role', 'textbox');
    this.container.setAttribute('aria-label', 'Document editor');

    // Ensure focus is maintained when clicking in the editor
    this.container.addEventListener('mousedown', () => {
      // Ensure focus before selection happens
      if (document.activeElement !== this.container) {
        this.container.focus();
      }
    });

    this.container.addEventListener('click', () => {
      // Ensure focus after click
      if (document.activeElement !== this.container) {
        this.container.focus();
      }
    });

    this.container.addEventListener('input', (e) => {
      const text = (e.target as HTMLElement).textContent || '';
      this.onInput(text);
      // Ensure focus is maintained after input
      if (document.activeElement !== this.container) {
        this.container.focus();
      }
    });

    this.container.addEventListener('keydown', (e) => {
      // Ensure focus is maintained
      if (document.activeElement !== this.container) {
        this.container.focus();
      }
      this.onKeyDown(e);
    });

    this.container.addEventListener('paste', (e) => {
      e.preventDefault();

      const clipboardData = e.clipboardData;
      if (!clipboardData) {
        return;
      }

      // Try to get HTML first to preserve formatting
      let html = clipboardData.getData('text/html');
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const plainText = clipboardData.getData('text/plain') ?? '';

      // If HTML is available, use it; otherwise use plain text
      if (html?.trim()) {
        // Clean and process the HTML
        html = this.sanitizePastedHtml(html);
        this.onPaste(html, true); // Pass true to indicate it's HTML
      } else {
        // Fallback to plain text
        this.onPaste(plainText, false);
      }
    });
  }

  private sanitizePastedHtml(html: string): string {
    // Create a temporary div to parse and clean the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove script tags and dangerous elements
    const scripts = tempDiv.querySelectorAll('script, style, iframe, object, embed');
    scripts.forEach((el) => el.remove());

    // Process all elements to ensure they're in paragraph tags
    const processNode = (node: Node): void => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        // Convert block elements to paragraphs (except p, div)
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'].includes(tagName)) {
          const p = document.createElement('p');
          p.innerHTML = element.innerHTML;
          element.parentNode?.replaceChild(p, element);
        }

        // Process children
        Array.from(element.childNodes).forEach(processNode);
      }
    };

    // Process all nodes
    Array.from(tempDiv.childNodes).forEach(processNode);

    // Get the cleaned HTML
    return tempDiv.innerHTML;
  }

  public render(state: EditorState): void {
    // Only update if content actually changed
    const newContent = this.renderer.render(state);
    const currentContent = this.container.innerHTML;

    // Compare without whitespace differences
    const normalize = (html: string) => html.replace(/\s+/g, ' ').trim();

    if (normalize(currentContent) !== normalize(newContent)) {
      // Preserve cursor position
      const cursorPosition = this.cursorManager.getCursorOffset();

      // Temporarily remove contenteditable to prevent input events
      this.container.setAttribute('contenteditable', 'false');
      this.container.innerHTML = newContent;
      this.container.setAttribute('contenteditable', 'true');

      // Restore cursor position
      if (cursorPosition !== null) {
        // Use setTimeout to ensure DOM is updated
        setTimeout(() => {
          this.cursorManager.setCursorPosition(cursorPosition);
          // Ensure focus is maintained after restoring cursor
          if (document.activeElement !== this.container) {
            this.container.focus();
          }
        }, 0);
      } else {
        // If no cursor position, ensure container still has focus
        if (document.activeElement !== this.container) {
          this.container.focus();
        }
      }
    }
  }

  public focus(): void {
    this.container.focus();
  }

  public getContainer(): HTMLElement {
    return this.container;
  }

}

