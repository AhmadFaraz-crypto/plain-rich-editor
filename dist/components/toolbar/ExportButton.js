/**
 * Export Button component - exports content to HTML
 */
import { createButton } from '../../utils/dom.js';
export class ExportButton {
    constructor(onExport) {
        this.onExport = onExport;
        this.button = this.createExportButton();
    }
    createExportButton() {
        const button = createButton('Export HTML', 'toolbar-button', () => this.onExport(), 'Export content to HTML');
        button.setAttribute('data-button-id', 'export-html');
        return button;
    }
    getElement() {
        return this.button;
    }
    setEnabled(enabled) {
        this.button.disabled = !enabled;
    }
}
//# sourceMappingURL=ExportButton.js.map