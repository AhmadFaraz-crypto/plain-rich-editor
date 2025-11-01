/**
 * Core types and interfaces for the Word-like editor
 */

export type TextAlignment = 'left' | 'center' | 'right' | 'justify';

export interface TextFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  alignment?: TextAlignment;
}

export interface EditorRange {
  start: number;
  end: number;
}

export interface ParagraphNode {
  id: string;
  type: 'paragraph';
  content: string;
  format: TextFormat;
}

export interface EditorState {
  content: ParagraphNode[];
  selection: EditorRange | null;
  activeFormat: TextFormat;
  history: EditorState[];
  historyIndex: number;
}

export interface EditorCommand {
  type: 'format' | 'insert' | 'delete' | 'paste';
  target?: EditorRange;
  format?: Partial<TextFormat>;
  text?: string;
}

export interface ToolbarButton {
  id: string;
  label: string;
  icon?: string;
  command: string;
  active?: boolean;
}

/**
 * Configuration options for RichEditor
 */
export interface RichEditorOptions {
  /**
   * Initial HTML content to load into the editor
   * @default ''
   */
  initialContent?: string;

  /**
   * Whether the editor is in readonly mode
   * @default false
   */
  readonly?: boolean;

  /**
   * Callback function called when content changes
   * @param content - The current HTML content
   */
  onContentChange?: (content: string) => void;

  /**
   * Callback function called when format changes
   * @param format - The current text format at cursor/selection
   */
  onFormatChange?: (format: TextFormat) => void;

  /**
   * Callback function called when selection changes
   * @param range - The current selection range (null if no selection)
   */
  onSelectionChange?: (range: EditorRange | null) => void;

  /**
   * Whether to show the HTML preview toggle button
   * @default true
   */
  showHtmlPreview?: boolean;

  /**
   * Initial view mode: 'editor', 'preview', or 'both'
   * @default 'editor'
   */
  initialViewMode?: 'editor' | 'preview' | 'both';

  /**
   * Array of extensions/plugins to load
   * @default []
   */
  extensions?: import('../core/Extension.js').Extension[];

  /**
   * Toolbar configuration options
   */
  toolbar?: ToolbarOptions;
}

/**
 * Toolbar configuration options
 */
export interface ToolbarOptions {
  /**
   * Show/hide format buttons (Bold, Italic, Underline)
   * @default true
   */
  showFormatButtons?: boolean;

  /**
   * Show/hide specific format buttons
   */
  formatButtons?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };

  /**
   * Show/hide font family dropdown
   * @default true
   */
  showFontFamily?: boolean;

  /**
   * Show/hide style dropdown (heading styles)
   * @default true
   */
  showStyleDropdown?: boolean;
}
