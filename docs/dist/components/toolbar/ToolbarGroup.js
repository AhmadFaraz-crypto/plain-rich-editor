/**
 * Toolbar group component - groups related toolbar buttons
 */
import { createElement } from '../../utils/dom.js';
export class ToolbarGroup {
    constructor() {
        this.elements = [];
        this.container = createElement('div', 'toolbar-group');
    }
    addElement(element) {
        this.elements.push(element);
        this.container.appendChild(element);
    }
    addSeparator() {
        const separator = createElement('div', 'toolbar-separator');
        this.container.appendChild(separator);
    }
    getElement() {
        return this.container;
    }
    clear() {
        this.container.innerHTML = '';
        this.elements = [];
    }
}
//# sourceMappingURL=ToolbarGroup.js.map