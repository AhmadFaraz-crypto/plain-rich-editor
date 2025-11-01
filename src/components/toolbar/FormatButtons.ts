/**
 * Format buttons component (Bold, Italic, Underline)
 */

import { ToolbarButton } from './ToolbarButton.js';
import { TOOLBAR_ICONS } from '../../utils/constants.js';
import type { TextFormat } from '../../types/editor.types.js';

export class FormatButtons {
  private buttons: Map<string, ToolbarButton>;
  private onCommand: (command: string) => void;
  private formatButtonConfig?: { bold?: boolean; italic?: boolean; underline?: boolean };

  constructor(
    onCommand: (command: string) => void,
    formatButtonConfig?: { bold?: boolean; italic?: boolean; underline?: boolean },
  ) {
    this.buttons = new Map();
    this.onCommand = onCommand;
    this.formatButtonConfig = formatButtonConfig;
  }

  public createButtons(): ToolbarButton[] {
    const formatButtons: Array<'bold' | 'italic' | 'underline'> = [
      'bold',
      'italic',
      'underline',
    ];

    return formatButtons
      .filter((type) => {
        // If config exists and button is explicitly set to false, hide it
        if (this.formatButtonConfig && this.formatButtonConfig[type] === false) {
          return false;
        }
        return true;
      })
      .map((type) => {
        const button = new ToolbarButton(
          {
            id: type,
            label: type.charAt(0).toUpperCase() + type.slice(1),
            command: type,
            icon: TOOLBAR_ICONS[type],
          },
          () => this.onCommand(type),
        );

        this.buttons.set(type, button);
        return button;
      });
  }

  public updateFormat(format: TextFormat): void {
    this.buttons.get('bold')?.setActive(format.bold === true);
    this.buttons.get('italic')?.setActive(format.italic === true);
    this.buttons.get('underline')?.setActive(format.underline === true);
  }
}

