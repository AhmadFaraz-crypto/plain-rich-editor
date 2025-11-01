/**
 * Command Handler - handles editor commands (bold, italic, underline, etc.)
 */

export class CommandHandler {
  private contentElement: HTMLElement;
  private onFormatUpdate: () => void;

  constructor(contentElement: HTMLElement, onFormatUpdate: () => void) {
    this.contentElement = contentElement;
    this.onFormatUpdate = onFormatUpdate;
  }

  public execute(command: string, value?: string | number): void {
    this.ensureFocus();

    if (this.handleTextFormatCommand(command)) {
      this.onFormatUpdate();
      return;
    }

    if (this.handleFontCommand(command, value)) {
      this.onFormatUpdate();
      return;
    }

    if (this.handleHistoryCommand(command)) {
      this.onFormatUpdate();
      return;
    }
  }

  private ensureFocus(): void {
    if (document.activeElement !== this.contentElement) {
      this.contentElement.focus();
    }
  }

  private handleTextFormatCommand(command: string): boolean {
    const commandMap: Record<string, string> = {
      'bold': 'bold',
      'italic': 'italic',
      'underline': 'underline',
    };

    const execCommand = commandMap[command];
    if (!execCommand) {
      return false;
    }

    document.execCommand(execCommand, false);
    return true;
  }

  private handleFontCommand(command: string, value?: string | number): boolean {
    const selection = window.getSelection();
    const hasSelection = selection && selection.rangeCount > 0 && !selection.isCollapsed;

    if (command === 'font-family' && typeof value === 'string') {
      this.handleFontFamily(value, selection, hasSelection ?? false);
      return true;
    }

    if (command === 'text-style' && typeof value === 'string') {
      this.handleTextStyle(value);
      return true;
    }


    return false;
  }

  private handleHistoryCommand(command: string): boolean {
    if (command === 'undo') {
      document.execCommand('undo', false);
      return true;
    }

    if (command === 'redo') {
      document.execCommand('redo', false);
      return true;
    }

    return false;
  }

  private handleFontFamily(fontFamily: string, selection: Selection | null, hasSelection: boolean): void {
    if (hasSelection && selection) {
      const range = selection.getRangeAt(0);
      try {
        const span = document.createElement('span');
        span.style.fontFamily = fontFamily;

        if (range.collapsed) {
          const parentElement = range.startContainer.nodeType === Node.TEXT_NODE
            ? (range.startContainer as Text).parentElement
            : range.startContainer as HTMLElement;

          if (parentElement && parentElement instanceof HTMLElement) {
            parentElement.style.fontFamily = fontFamily;
          }
        } else {
          range.surroundContents(span);
        }
      } catch (error) {
        // Fallback: apply to parent
        const parentElement = range.startContainer.nodeType === Node.TEXT_NODE
          ? (range.startContainer as Text).parentElement
          : range.startContainer as HTMLElement;

        if (parentElement && parentElement instanceof HTMLElement) {
          parentElement.style.fontFamily = fontFamily;
        }
      }
    } else {
      // Apply to current format for next typing
      const currentElement = this.contentElement.querySelector('p') ?? this.contentElement;
      currentElement.style.fontFamily = fontFamily;
    }
  }

  private handleTextStyle(style: string): void {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    try {
      switch (style) {
        case 'normal':
          document.execCommand('formatBlock', false, 'p');
          break;
        case 'heading1':
          document.execCommand('formatBlock', false, 'h1');
          break;
        case 'heading2':
          document.execCommand('formatBlock', false, 'h2');
          break;
        case 'heading3':
          document.execCommand('formatBlock', false, 'h3');
          break;
        case 'heading4':
          document.execCommand('formatBlock', false, 'h4');
          break;
        case 'heading5':
          document.execCommand('formatBlock', false, 'h5');
          break;
        case 'heading6':
          document.execCommand('formatBlock', false, 'h6');
          break;
        default:
          document.execCommand('formatBlock', false, 'p');
      }
    } catch (error) {
      // Fallback if execCommand fails
    }
  }
}
