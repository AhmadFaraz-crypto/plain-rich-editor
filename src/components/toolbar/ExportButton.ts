/**
 * Export Button component - exports content to HTML
 */

import { createButton } from '../../utils/dom.js';

export class ExportButton {
  private button: HTMLButtonElement;
  private onExport: () => void;

  constructor(onExport: () => void) {
    this.onExport = onExport;
    this.button = this.createExportButton();
  }

  private createExportButton(): HTMLButtonElement {
    const button = createButton(
      'Export HTML',
      'toolbar-button',
      () => this.onExport(),
      'Export content to HTML',
    );
    button.setAttribute('data-button-id', 'export-html');
    return button;
  }

  public getElement(): HTMLButtonElement {
    return this.button;
  }

  public setEnabled(enabled: boolean): void {
    this.button.disabled = !enabled;
  }
}

