/**
 * Extension interface for RichEditor plugins
 * 
 * This allows developers to extend the editor with custom features
 * like tables, images, videos, custom formatting, etc.
 */

import type { TextFormat, EditorState, EditorRange } from '../types/editor.types.js';

/**
 * Extension lifecycle hooks
 */
export interface ExtensionLifecycle {
  /**
   * Called when the extension is registered with the editor
   * @param editor - The RichEditor instance
   */
  onRegister?(editor: RichEditorInstance): void;

  /**
   * Called when the editor is initialized
   */
  onInit?(): void;

  /**
   * Called when the editor is destroyed
   */
  onDestroy?(): void;
}

/**
 * Toolbar extension - adds custom toolbar buttons
 */
export interface ToolbarExtension {
  /**
   * Returns custom toolbar buttons/controls
   * @returns Array of toolbar elements (buttons, dropdowns, etc.)
   */
  getToolbarElements?(): HTMLElement[];
}

/**
 * Command extension - handles custom commands
 */
export interface CommandExtension {
  /**
   * Checks if this extension can handle the given command
   * @param command - The command name
   * @param value - Optional command value
   * @returns true if this extension handles the command
   */
  canHandleCommand?(command: string, value?: string | number): boolean;

  /**
   * Executes a command
   * @param command - The command name
   * @param value - Optional command value
   * @returns true if command was handled
   */
  executeCommand?(command: string, value?: string | number): boolean;
}

/**
 * Format extension - custom formatting options
 */
export interface FormatExtension {
  /**
   * Gets custom format from selection
   * @param range - Current selection range
   * @returns Custom format object (merged with TextFormat)
   */
  getFormat?(range: Range): Partial<TextFormat> | null;

  /**
   * Applies custom format to selection
   * @param format - Format to apply
   * @param range - Selection range
   */
  applyFormat?(format: Partial<TextFormat>, range: Range): void;
}

/**
 * Content extension - custom content handlers
 */
export interface ContentExtension {
  /**
   * Transforms content before insertion
   * @param content - Content to be inserted
   * @param isHtml - Whether content is HTML
   * @returns Transformed content
   */
  transformContent?(content: string, isHtml: boolean): string;

  /**
   * Serializes custom content to HTML
   * @param element - DOM element to serialize
   * @returns HTML string
   */
  serializeToHtml?(element: HTMLElement): string | null;

  /**
   * Deserializes HTML to custom content
   * @param html - HTML string
   * @returns DOM element or null
   */
  deserializeFromHtml?(html: string): HTMLElement | null;
}

/**
 * Event extension - custom event handlers
 */
export interface EventExtension {
  /**
   * Handles keyboard events
   * @param event - Keyboard event
   * @returns true if event was handled (prevents default)
   */
  onKeyDown?(event: KeyboardEvent): boolean;

  /**
   * Handles paste events
   * @param data - Paste data
   * @param isHtml - Whether paste data is HTML
   * @returns true if paste was handled
   */
  onPaste?(data: string, isHtml: boolean): boolean;

  /**
   * Handles input events
   * @param text - Input text
   */
  onInput?(text: string): void;
}

/**
 * Menu extension - adds context menu items
 */
export interface MenuExtension {
  /**
   * Gets context menu items
   * @param range - Current selection range
   * @returns Array of menu items
   */
  getContextMenuItems?(range: Range): ContextMenuItem[];
}

/**
 * Context menu item
 */
export interface ContextMenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
  separator?: boolean;
}

/**
 * RichEditor instance interface exposed to extensions
 */
export interface RichEditorInstance {
  getContent(): string;
  setContent(html: string): void;
  getState(): EditorState;
  focus(): void;
  executeCommand(command: string, value?: string | number): void;
  getContainer(): HTMLElement;
  getContentElement(): HTMLElement;
  getSelection(): EditorRange | null;
}

/**
 * Base extension interface
 * Extensions can implement any combination of extension interfaces
 */
export interface Extension extends 
  ExtensionLifecycle,
  Partial<ToolbarExtension>,
  Partial<CommandExtension>,
  Partial<FormatExtension>,
  Partial<ContentExtension>,
  Partial<EventExtension>,
  Partial<MenuExtension> {
  /**
   * Unique extension identifier
   */
  id: string;

  /**
   * Extension name
   */
  name: string;

  /**
   * Extension version
   */
  version?: string;
}

