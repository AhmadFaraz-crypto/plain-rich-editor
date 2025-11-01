/**
 * Paste Handler - handles paste functionality with HTML and plain text support
 */

import { EditorEngine } from '../../core/EditorEngine.js';

export class PasteHandler {
  private contentElement: HTMLElement;
  private engine: EditorEngine;

  constructor(contentElement: HTMLElement, engine: EditorEngine) {
    this.contentElement = contentElement;
    this.engine = engine;
  }

  public handle(content: string, isHtml: boolean, onFormatUpdate: () => void): void {
    // Ensure the content element has focus
    if (document.activeElement !== this.contentElement) {
      this.contentElement.focus();
    }

    // Get current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);

    // Delete selected content if any
    if (!selection.isCollapsed) {
      range.deleteContents();
    }

    // If it's HTML, insert it directly into the DOM to preserve formatting
    if (isHtml && content.trim()) {
      this.insertHtml(content, range, selection);
      this.normalizePastedContent();
      onFormatUpdate();
    } else {
      // Plain text - use engine's text insertion
      this.insertPlainText(content);
    }
  }

  private insertHtml(content: string, range: Range, selection: Selection): void {
    // Create a temporary container to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Insert each child node
    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }

    // Insert the fragment at cursor position
    range.insertNode(fragment);

    // Move cursor to end of inserted content
    range.setStartAfter(fragment.lastChild ?? range.startContainer);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private insertPlainText(text: string): void {
    const state = this.engine.getState();
    const selection = state.selection;

    if (selection && selection.start !== selection.end) {
      // Replace selected text
      this.engine.executeCommand({
        type: 'paste',
        target: selection,
        text: text,
      });
    } else {
      // Insert at cursor
      const cursorPos = selection?.start ?? 0;
      this.engine.insertText(text, cursorPos);
    }
  }

  private normalizePastedContent(): void {
    // Ensure all content is wrapped in paragraph tags
    const walker = document.createTreeWalker(
      this.contentElement,
      NodeFilter.SHOW_ELEMENT,
      null,
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      // If it's a direct child text node or invalid element, wrap it in p
      if (tagName === 'div' || tagName === 'br') {
        const parent = element.parentNode;
        if (parent && parent !== this.contentElement) {
          // Already inside a paragraph or other container
          continue;
        }

        // Replace div with p
        if (tagName === 'div') {
          const p = document.createElement('p');
          p.innerHTML = element.innerHTML;
          parent?.replaceChild(p, element);
        }
      }
    }

    // Clean up empty paragraphs
    const paragraphs = this.contentElement.querySelectorAll('p');
    paragraphs.forEach((p) => {
      if (!p.textContent.trim() && p.children.length === 0) {
        // Add zero-width space to maintain paragraph
        if (!p.textContent) {
          p.appendChild(document.createTextNode('\u200B'));
        }
      }
    });
  }
}
