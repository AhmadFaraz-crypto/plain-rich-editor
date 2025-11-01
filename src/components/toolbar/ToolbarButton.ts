/**
 * Toolbar button component
 */

import { createButton } from '../../utils/dom.js';

export interface ToolbarButtonConfig {
  id: string;
  label: string;
  command: string;
  icon?: string;
}

export class ToolbarButton {
  private button: HTMLButtonElement;
  private isActive: boolean = false;

  constructor(config: ToolbarButtonConfig, onClick: () => void) {
    this.button = createButton(
      config.icon ?? config.label,
      'toolbar-button',
      onClick,
      config.label,
    );

    this.button.setAttribute('data-command', config.command);
    this.button.setAttribute('data-button-id', config.id);
  }

  public getElement(): HTMLButtonElement {
    return this.button;
  }

  public setActive(active: boolean): void {
    this.isActive = active;
    if (active) {
      this.button.classList.add('active');
    } else {
      this.button.classList.remove('active');
    }
  }

  public setDisabled(disabled: boolean): void {
    this.button.disabled = disabled;
  }

  public isButtonActive(): boolean {
    return this.isActive;
  }
}

