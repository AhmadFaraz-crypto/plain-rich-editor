/**
 * Style dropdown component - Text styles (Normal, Heading 1, etc.)
 */
import { createSelect } from '../../utils/dom.js';
const TEXT_STYLES = [
    { value: 'normal', label: 'Normal' },
    { value: 'heading1', label: 'Heading 1' },
    { value: 'heading2', label: 'Heading 2' },
    { value: 'heading3', label: 'Heading 3' },
    { value: 'heading4', label: 'Heading 4' },
    { value: 'heading5', label: 'Heading 5' },
    { value: 'heading6', label: 'Heading 6' },
];
export class StyleDropdown {
    constructor(onStyleChange) {
        this.onStyleChange = onStyleChange;
        this.select = this.createStyleSelect();
    }
    createStyleSelect() {
        const select = createSelect('toolbar-dropdown', TEXT_STYLES, (value) => this.onStyleChange(value), 'Text Style');
        select.className = 'toolbar-dropdown';
        select.value = 'normal';
        return select;
    }
    getElement() {
        return this.select;
    }
    setStyle(style) {
        this.select.value = style;
    }
}
//# sourceMappingURL=StyleDropdown.js.map