/**
 * Cursor position manager - handles cursor position preservation and restoration
 */
export class CursorManager {
    constructor(container) {
        this.container = container;
    }
    getCursorOffset() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return null;
        }
        const range = selection.getRangeAt(0);
        let offset = 0;
        const walker = document.createTreeWalker(this.container, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
        let node;
        while ((node = walker.nextNode())) {
            if (node === range.startContainer) {
                if (node.nodeType === Node.TEXT_NODE) {
                    offset += range.startOffset;
                }
                break;
            }
            if (node.nodeType === Node.TEXT_NODE) {
                offset += node.textContent.length || 0;
            }
            else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
                if (node !== this.container.lastChild) {
                    offset += 1; // Paragraph break
                }
            }
        }
        return offset;
    }
    setCursorPosition(offset) {
        try {
            // Ensure container has focus before setting cursor
            if (document.activeElement !== this.container) {
                this.container.focus();
            }
            const range = document.createRange();
            let currentOffset = 0;
            const walker = document.createTreeWalker(this.container, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
            let node;
            while ((node = walker.nextNode())) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const textNode = node;
                    const textLength = textNode.textContent.length || 0;
                    if (currentOffset <= offset && offset <= currentOffset + textLength) {
                        range.setStart(textNode, offset - currentOffset);
                        range.setEnd(textNode, offset - currentOffset);
                        const selection = window.getSelection();
                        if (selection) {
                            selection.removeAllRanges();
                            selection.addRange(range);
                            // Ensure container maintains focus after setting cursor
                            if (document.activeElement !== this.container) {
                                this.container.focus();
                            }
                        }
                        break;
                    }
                    currentOffset += textLength;
                }
                else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
                    if (node !== this.container.lastChild && offset === currentOffset) {
                        const textNodes = this.getTextNodes(node);
                        if (textNodes.length > 0) {
                            range.setStart(textNodes[0], 0);
                            range.setEnd(textNodes[0], 0);
                            const selection = window.getSelection();
                            if (selection) {
                                selection.removeAllRanges();
                                selection.addRange(range);
                                // Ensure container maintains focus after setting cursor
                                if (document.activeElement !== this.container) {
                                    this.container.focus();
                                }
                            }
                        }
                        break;
                    }
                    if (node !== this.container.lastChild) {
                        currentOffset += 1;
                    }
                }
            }
        }
        catch (error) {
            // Silently fail if cursor cannot be set
        }
    }
    getTextNodes(container) {
        const textNodes = [];
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node);
            }
        }
        return textNodes;
    }
}
//# sourceMappingURL=CursorManager.js.map