/**
 * Format State Manager - handles format state detection and updates
 */

import type { TextFormat } from '../../types/editor.types.js';

export class FormatStateManager {
  private lastSelectionRange: { start: number; end: number; container: Node } | null = null;
  private updateFormatStateTimer: number | null = null;
  private onFormatUpdate: (format: TextFormat) => void;
  private contentElement: HTMLElement | null = null;

  constructor(onFormatUpdate: (format: TextFormat) => void) {
    this.onFormatUpdate = onFormatUpdate;
  }

  public setContentElement(element: HTMLElement): void {
    this.contentElement = element;
  }

  public debouncedUpdate(): void {
    // Clear existing timer
    if (this.updateFormatStateTimer !== null) {
      window.clearTimeout(this.updateFormatStateTimer);
    }

    // Debounce format state updates (150ms delay)
    this.updateFormatStateTimer = window.setTimeout(() => {
      this.update();
      this.updateFormatStateTimer = null;
    }, 150);
  }

  public update(force: boolean = false): void {
    // Check if selection actually changed
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // No selection, try to get format from content element or use default
      let fontFamily = 'Arial, sans-serif';
      let color = '#000000';
      let alignment: 'left' | 'center' | 'right' | 'justify' = 'left';

      // If content element exists, try to get current format from it
      if (this.contentElement) {
        try {
          // Get the last paragraph or the content element itself
          const paragraphs = this.contentElement.querySelectorAll('p');
          const lastParagraph = paragraphs.length > 0 ? paragraphs[paragraphs.length - 1] : this.contentElement;
          if (lastParagraph) {
            const computed = window.getComputedStyle(lastParagraph as Element);
            if (computed.fontFamily) {
              fontFamily = computed.fontFamily;
            }
            if (computed.color) {
              color = computed.color;
            }
            if (computed.textAlign) {
              alignment = computed.textAlign as 'left' | 'center' | 'right' | 'justify';
            }
          }
        } catch (error) {
          // Fallback to defaults if error occurs
        }
      }

      this.onFormatUpdate({
        bold: false,
        italic: false,
        underline: false,
        fontSize: 12,
        fontFamily,
        color,
        alignment,
      });
      this.lastSelectionRange = null;
      return;
    }

    try {
      const range = selection.getRangeAt(0);
      const start = range.startOffset;
      const end = range.endOffset;
      const container = range.commonAncestorContainer;

      // Only update if selection actually changed, unless forced
      if (!force && this.lastSelectionRange &&
          this.lastSelectionRange.start === start &&
          this.lastSelectionRange.end === end &&
          container === this.lastSelectionRange.container) {
        return; // Selection hasn't changed, skip update
      }

      // Cache current selection
      this.lastSelectionRange = { start, end, container };

      // Get format efficiently
      const format = this.getCurrentFormat(range);
      this.onFormatUpdate(format);
    } catch (error) {
      // Selection might be invalid, use default format
      this.onFormatUpdate({
        bold: false,
        italic: false,
        underline: false,
        fontSize: 12,
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        alignment: 'left',
      });
      this.lastSelectionRange = null;
    }
  }

  private getCurrentFormat(range: Range): TextFormat {
    const format: TextFormat = {
      bold: false,
      italic: false,
      underline: false,
      fontSize: 12,
      fontFamily: 'Arial, sans-serif',
      color: '#000000',
      alignment: 'left',
    };

    try {
      // Use document.queryCommandState to check if format is active at cursor/selection
      // This is more reliable than checking DOM elements
      // However, we need to ensure the editor is focused for queryCommandState to work correctly
      const isFocused = document.activeElement &&
        document.activeElement === document.querySelector('.editor-content');

      if (isFocused) {
        format.bold = document.queryCommandState('bold');
        format.italic = document.queryCommandState('italic');
        format.underline = document.queryCommandState('underline');
      } else {
        // Fallback: check format using DOM if not focused
        format.bold = this.checkBoldAtRange(range);
        format.italic = this.checkItalicAtRange(range);
        format.underline = this.checkUnderlineAtRange(range);
      }

      let element: Element | null = null;

      if (range.collapsed) {
        // Get current element
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          element = (range.startContainer as Text).parentElement;
        } else {
          element = range.startContainer as Element;
        }
      } else {
        // Get first element in selection
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          element = (range.startContainer as Text).parentElement;
        } else {
          element = range.startContainer as Element;
        }
      }

      if (element) {
        const computed = window.getComputedStyle(element);

        // Font size detection removed - not handling font size changes

        if (computed.fontFamily) {
          format.fontFamily = computed.fontFamily;
        }

        if (computed.color) {
          format.color = computed.color;
        }

        if (computed.textAlign) {
          format.alignment = computed.textAlign as 'left' | 'center' | 'right' | 'justify';
        }
      }
    } catch (error) {
      // Fallback to defaults
    }

    return format;
  }

  private checkBoldAtRange(range: Range): boolean {
    try {
      // Check format at the exact cursor/selection position
      let element: Element | null = null;

      if (range.collapsed) {
        // For collapsed selection, check the container element
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          element = (range.startContainer as Text).parentElement;
        } else {
          element = range.startContainer as Element;
        }
      } else {
        // For non-collapsed selection, check the first element
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          element = (range.startContainer as Text).parentElement;
        } else {
          element = range.startContainer as Element;
        }
      }

      if (!element) {
        return false;
      }

      // Check if we're directly in a bold element or its parent
      if (element.tagName === 'STRONG' || element.tagName === 'B') {
        return true;
      }

      // Check computed style at the exact position
      const computed = window.getComputedStyle(element);
      const fontWeight = parseInt(computed.fontWeight);
      return computed.fontWeight === 'bold' || (fontWeight >= 700 && !isNaN(fontWeight));
    } catch {
      return false;
    }
  }

  private checkBold(el: Element | null): boolean {
    if (!el) {return false;}

    if (el.tagName === 'STRONG' || el.tagName === 'B') {
      return true;
    }

    const boldChild = el.querySelector('strong, b');
    if (boldChild) {return true;}

    // Check if we're inside a bold element
    const boldParent = el.closest('strong, b');
    if (boldParent) {return true;}

    // Check computed style
    const computed = window.getComputedStyle(el);
    return computed.fontWeight === 'bold' || parseInt(computed.fontWeight) >= 700;
  }

  private checkItalicAtRange(range: Range): boolean {
    try {
      let element: Element | null = null;

      if (range.collapsed) {
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          element = (range.startContainer as Text).parentElement;
        } else {
          element = range.startContainer as Element;
        }
      } else {
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          element = (range.startContainer as Text).parentElement;
        } else {
          element = range.startContainer as Element;
        }
      }

      if (!element) {
        return false;
      }

      if (element.tagName === 'EM' || element.tagName === 'I') {
        return true;
      }

      const computed = window.getComputedStyle(element);
      return computed.fontStyle === 'italic';
    } catch {
      return false;
    }
  }

  private checkItalic(el: Element | null): boolean {
    if (!el) {return false;}

    if (el.tagName === 'EM' || el.tagName === 'I') {
      return true;
    }

    const italicChild = el.querySelector('em, i');
    if (italicChild) {return true;}

    // Check if we're inside an italic element
    const italicParent = el.closest('em, i');
    if (italicParent) {return true;}

    // Check computed style
    const computed = window.getComputedStyle(el);
    return computed.fontStyle === 'italic';
  }

  private checkUnderlineAtRange(range: Range): boolean {
    try {
      let element: Element | null = null;

      if (range.collapsed) {
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          element = (range.startContainer as Text).parentElement;
        } else {
          element = range.startContainer as Element;
        }
      } else {
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          element = (range.startContainer as Text).parentElement;
        } else {
          element = range.startContainer as Element;
        }
      }

      if (!element) {
        return false;
      }

      if (element.tagName === 'U') {
        return true;
      }

      const computed = window.getComputedStyle(element);
      return computed.textDecoration.includes('underline');
    } catch {
      return false;
    }
  }

  private checkUnderline(el: Element | null): boolean {
    if (!el) {return false;}

    if (el.tagName === 'U') {
      return true;
    }

    const underlineChild = el.querySelector('u');
    if (underlineChild) {return true;}

    // Check if we're inside an underline element
    const underlineParent = el.closest('u');
    if (underlineParent) {return true;}

    // Check computed style
    const computed = window.getComputedStyle(el);
    return computed.textDecoration.includes('underline');
  }

  public clearCache(): void {
    // Clear the selection range cache to force format detection on next update
    this.lastSelectionRange = null;
  }

  public destroy(): void {
    if (this.updateFormatStateTimer !== null) {
      window.clearTimeout(this.updateFormatStateTimer);
      this.updateFormatStateTimer = null;
    }
  }
}
