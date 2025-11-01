/**
 * Manages text selection and cursor position in the editor
 */

import type { EditorRange } from '../types/editor.types.js';

export class SelectionManager {
  private containerElement: HTMLElement;
  private onSelectionChange: (range: EditorRange | null) => void;

  constructor(
    containerElement: HTMLElement,
    onSelectionChange: (range: EditorRange | null) => void,
  ) {
    this.containerElement = containerElement;
    this.onSelectionChange = onSelectionChange;
    this.initialize();
  }

  private initialize(): void {
    this.containerElement.addEventListener('mouseup', () => this.handleSelectionChange());
    this.containerElement.addEventListener('keyup', () => this.handleSelectionChange());
    this.containerElement.addEventListener('focus', () => this.handleSelectionChange());
  }

  public handleSelectionChange(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      this.onSelectionChange(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const editorRange = this.getEditorRange(range);

    if (editorRange) {
      this.onSelectionChange(editorRange);
    }
  }

  private getEditorRange(range: Range): EditorRange | null {
    try {
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      if (!this.containerElement.contains(startContainer) || !this.containerElement.contains(endContainer)) {
        return null;
      }

      const startOffset = this.getTextOffset(startContainer, range.startOffset);
      const endOffset = this.getTextOffset(endContainer, range.endOffset);

      if (startOffset === null || endOffset === null) {
        return null;
      }

      return {
        start: Math.min(startOffset, endOffset),
        end: Math.max(startOffset, endOffset),
      };
    } catch (error) {
      return null;
    }
  }

  private getTextOffset(node: Node, offset: number): number | null {
    let totalOffset = 0;
    let found = false;

    const walker = document.createTreeWalker(
      this.containerElement,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            return NodeFilter.FILTER_ACCEPT;
          }
          if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'P') {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        },
      },
    );

    let currentNode: Node | null;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const textNode = currentNode as Text;
        if (textNode === node || textNode.parentElement?.contains(node)) {
          if (textNode === node) {
            totalOffset += offset;
          } else {
            totalOffset += textNode.textContent.length || 0;
          }
          found = true;
          break;
        }
        totalOffset += textNode.textContent.length || 0;
      } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const element = currentNode as HTMLElement;
        if (element.tagName === 'P') {
          // Add 1 for paragraph break (except for last paragraph)
          if (element.nextSibling) {
            totalOffset += 1;
          }
        }
      }
    }

    return found ? totalOffset : null;
  }

  public setSelection(range: EditorRange | null): void {
    if (!range) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      return;
    }

    try {
      const domRange = this.getDOMRange(range);
      if (domRange) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(domRange);
      }
    } catch (error) {
      // Silently fail if selection cannot be set
    }
  }

  private getDOMRange(range: EditorRange): Range | null {
    try {
      const domRange = document.createRange();
      let currentOffset = 0;
      let startFound = false;
      let endFound = false;

      const paragraphs = this.containerElement.querySelectorAll('p');
      let startContainer: Node | null = null;
      let startOffset = 0;
      let endContainer: Node | null = null;
      let endOffset = 0;

      for (const paragraph of paragraphs) {
        const textNodes = this.getTextNodes(paragraph);
        const paragraphLength = paragraph.textContent.length || 0;

        for (const textNode of textNodes) {
          const textLength = textNode.textContent.length || 0;

          // Check start
          if (!startFound && currentOffset <= range.start && range.start < currentOffset + textLength) {
            startContainer = textNode;
            startOffset = range.start - currentOffset;
            startFound = true;
          }

          // Check end
          if (!endFound && currentOffset <= range.end && range.end <= currentOffset + textLength) {
            endContainer = textNode;
            endOffset = range.end - currentOffset;
            endFound = true;
          }

          if (startFound && endFound) {
            break;
          }

          currentOffset += textLength;
        }

        if (startFound && endFound) {
          break;
        }

        // Add 1 for paragraph break
        if (paragraph !== paragraphs[paragraphs.length - 1]) {
          currentOffset += 1;
        }
      }

      if (startContainer && endContainer) {
        domRange.setStart(startContainer, startOffset);
        domRange.setEnd(endContainer, endOffset);
        return domRange;
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  private getTextNodes(container: Node): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);

    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node as Text);
      }
    }

    return textNodes;
  }

  public destroy(): void {
    // Cleanup event listeners if needed
  }
}

