/**
 * Style dropdown component - Text styles (Normal, Heading 1, etc.)
 */

import { createSelect } from '../../utils/dom.js';

export interface StyleOption {
  value: string;
  label: string;
}

const TEXT_STYLES: StyleOption[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'heading1', label: 'Heading 1' },
  { value: 'heading2', label: 'Heading 2' },
  { value: 'heading3', label: 'Heading 3' },
  { value: 'heading4', label: 'Heading 4' },
  { value: 'heading5', label: 'Heading 5' },
  { value: 'heading6', label: 'Heading 6' },
];

export class StyleDropdown {
  private select: HTMLSelectElement;
  private onStyleChange: (style: string) => void;

  constructor(onStyleChange: (style: string) => void) {
    this.onStyleChange = onStyleChange;
    this.select = this.createStyleSelect();
  }

  private createStyleSelect(): HTMLSelectElement {
    const select = createSelect(
      'toolbar-dropdown',
      TEXT_STYLES,
      (value) => this.onStyleChange(value),
      'Text Style',
    );
    select.className = 'toolbar-dropdown';
    select.value = 'normal';
    return select;
  }

  public getElement(): HTMLSelectElement {
    return this.select;
  }

  public setStyle(style: string): void {
    this.select.value = style;
  }
}

