/**
 * Extension Manager - handles registration and execution of editor extensions
 */

import type { Extension, RichEditorInstance } from './Extension.js';

export class ExtensionManager {
  private extensions: Map<string, Extension> = new Map();
  private editor: RichEditorInstance | null = null;

  /**
   * Registers an extension with the editor
   * @param extension - The extension to register
   */
  public register(extension: Extension): void {
    if (this.extensions.has(extension.id)) {
      console.warn(`Extension ${extension.id} is already registered`);
      return;
    }

    this.extensions.set(extension.id, extension);

    // Call onRegister hook if available
    if (this.editor && extension.onRegister) {
      extension.onRegister(this.editor);
    }
  }

  /**
   * Unregisters an extension
   * @param extensionId - The extension ID to unregister
   */
  public unregister(extensionId: string): void {
    const extension = this.extensions.get(extensionId);
    if (extension) {
      if (extension.onDestroy) {
        extension.onDestroy();
      }
      this.extensions.delete(extensionId);
    }
  }

  /**
   * Sets the editor instance (called during initialization)
   * @param editor - The RichEditor instance
   */
  public setEditor(editor: RichEditorInstance): void {
    this.editor = editor;

    // Call onRegister for all existing extensions
    this.extensions.forEach((extension) => {
      if (extension.onRegister) {
        extension.onRegister(editor);
      }
    });

    // Call onInit for all extensions
    this.extensions.forEach((extension) => {
      if (extension.onInit) {
        extension.onInit();
      }
    });
  }

  /**
   * Gets all toolbar elements from extensions
   * @returns Array of toolbar elements
   */
  public getToolbarElements(): HTMLElement[] {
    const elements: HTMLElement[] = [];

    this.extensions.forEach((extension) => {
      if (extension.getToolbarElements) {
        const extensionElements = extension.getToolbarElements();
        if (extensionElements) {
          elements.push(...extensionElements);
        }
      }
    });

    return elements;
  }

  /**
   * Executes a command through extensions
   * @param command - Command name
   * @param value - Optional command value
   * @returns true if command was handled by an extension
   */
  public executeCommand(command: string, value?: string | number): boolean {
    for (const extension of this.extensions.values()) {
      if (extension.canHandleCommand && extension.canHandleCommand(command, value)) {
        if (extension.executeCommand && extension.executeCommand(command, value)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Gets custom format from extensions
   * @param range - Selection range
   * @returns Merged format object
   */
  public getFormat(range: Range): Partial<import('../types/editor.types.js').TextFormat> {
    const format: Partial<import('../types/editor.types.js').TextFormat> = {};

    this.extensions.forEach((extension) => {
      if (extension.getFormat) {
        const extensionFormat = extension.getFormat(range);
        if (extensionFormat) {
          Object.assign(format, extensionFormat);
        }
      }
    });

    return format;
  }

  /**
   * Applies format through extensions
   * @param format - Format to apply
   * @param range - Selection range
   */
  public applyFormat(
    format: Partial<import('../types/editor.types.js').TextFormat>,
    range: Range,
  ): void {
    this.extensions.forEach((extension) => {
      if (extension.applyFormat) {
        extension.applyFormat(format, range);
      }
    });
  }

  /**
   * Transforms content through extensions
   * @param content - Content to transform
   * @param isHtml - Whether content is HTML
   * @returns Transformed content
   */
  public transformContent(content: string, isHtml: boolean): string {
    let transformed = content;

    this.extensions.forEach((extension) => {
      if (extension.transformContent) {
        transformed = extension.transformContent(transformed, isHtml);
      }
    });

    return transformed;
  }

  /**
   * Handles keyboard event through extensions
   * @param event - Keyboard event
   * @returns true if event was handled
   */
  public handleKeyDown(event: KeyboardEvent): boolean {
    for (const extension of this.extensions.values()) {
      if (extension.onKeyDown && extension.onKeyDown(event)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Handles paste event through extensions
   * @param data - Paste data
   * @param isHtml - Whether paste data is HTML
   * @returns true if paste was handled
   */
  public handlePaste(data: string, isHtml: boolean): boolean {
    for (const extension of this.extensions.values()) {
      if (extension.onPaste && extension.onPaste(data, isHtml)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Handles input event through extensions
   * @param text - Input text
   */
  public handleInput(text: string): void {
    this.extensions.forEach((extension) => {
      if (extension.onInput) {
        extension.onInput(text);
      }
    });
  }

  /**
   * Gets context menu items from extensions
   * @param range - Selection range
   * @returns Array of menu items
   */
  public getContextMenuItems(range: Range): import('./Extension.js').ContextMenuItem[] {
    const items: import('./Extension.js').ContextMenuItem[] = [];

    this.extensions.forEach((extension) => {
      if (extension.getContextMenuItems) {
        const extensionItems = extension.getContextMenuItems(range);
        if (extensionItems) {
          items.push(...extensionItems);
        }
      }
    });

    return items;
  }

  /**
   * Destroys all extensions
   */
  public destroy(): void {
    this.extensions.forEach((extension) => {
      if (extension.onDestroy) {
        extension.onDestroy();
      }
    });

    this.extensions.clear();
    this.editor = null;
  }

  /**
   * Gets all registered extensions
   * @returns Array of extension IDs
   */
  public getExtensions(): string[] {
    return Array.from(this.extensions.keys());
  }
}

