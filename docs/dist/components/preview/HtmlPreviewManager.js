/**
 * HTML Preview Manager - handles HTML preview display and formatting
 */
import { HtmlConverter } from '../../utils/HtmlConverter.js';
export class HtmlPreviewManager {
    constructor(htmlPreviewContainer, htmlPreviewContent, htmlPreviewCode) {
        this.contentElement = null;
        this.htmlPreviewContainer = htmlPreviewContainer;
        this.htmlPreviewContent = htmlPreviewContent;
        this.htmlPreviewCode = htmlPreviewCode;
    }
    setContentElement(element) {
        this.contentElement = element;
    }
    update() {
        if (!this.contentElement?.parentNode) {
            const emptyHtml = '<div></div>';
            this.updatePreview('', emptyHtml);
            return;
        }
        // Force a re-read from the DOM by cloning the element fresh
        // This ensures we get the most up-to-date content even after deletions
        const selection = window.getSelection();
        let html;
        // Check if there's a selection
        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
            // User has selected text - show only selected content
            const range = selection.getRangeAt(0);
            const container = document.createElement('div');
            container.appendChild(range.cloneContents());
            html = HtmlConverter.convertToHtml(container);
        }
        else {
            // No selection - show all content
            // Clone the element to ensure we get fresh content from DOM
            const clonedElement = this.contentElement.cloneNode(true);
            html = HtmlConverter.convertToHtml(clonedElement);
        }
        // Wrap in div tag (not full HTML document)
        const divHtml = `<div>${html}</div>`;
        this.updatePreview(html, divHtml);
    }
    updatePreview(html, fullHtml) {
        // Format HTML with basic indentation for Code view
        const formatted = this.formatHtml(fullHtml);
        // Update PREVIEW tab - show RENDERED HTML (how it looks visually)
        if (this.htmlPreviewContent) {
            this.htmlPreviewContent.innerHTML = '';
            const wrapperDiv = document.createElement('div');
            wrapperDiv.style.width = '100%';
            wrapperDiv.style.height = '100%';
            wrapperDiv.innerHTML = html; // Render the HTML so styles are applied
            this.htmlPreviewContent.appendChild(wrapperDiv);
        }
        // Update CODE tab - show HTML SOURCE CODE (formatted text)
        const codeElement = this.htmlPreviewCode?.querySelector('code');
        if (codeElement) {
            codeElement.textContent = formatted; // Show as plain text code
        }
    }
    formatHtml(html) {
        // Remove wrapper div if present for formatting
        let content = html.trim();
        if (content.startsWith('<div>') && content.endsWith('</div>')) {
            content = content.slice(5, -6).trim();
        }
        // Basic HTML formatting (could be improved with a proper formatter)
        let formatted = content;
        formatted = formatted.replace(/></g, '>\n<');
        formatted = formatted.replace(/\n\s*\n/g, '\n');
        // Basic indentation
        const lines = formatted.split('\n');
        let indent = 2; // Start with 2 spaces inside div
        const indented = lines.map((line) => {
            const trimmed = line.trim();
            if (!trimmed) {
                return '';
            }
            if (trimmed.startsWith('</')) {
                indent = Math.max(2, indent - 2);
            }
            const indentedLine = ' '.repeat(indent) + trimmed;
            if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
                indent += 2;
            }
            return indentedLine;
        });
        // Wrap back in div
        return '<div>\n' + indented.join('\n') + '\n</div>';
    }
    show() {
        this.htmlPreviewContainer.style.display = 'flex';
    }
    hide() {
        this.htmlPreviewContainer.style.display = 'none';
    }
    isVisible() {
        return this.htmlPreviewContainer.style.display !== 'none';
    }
}
//# sourceMappingURL=HtmlPreviewManager.js.map