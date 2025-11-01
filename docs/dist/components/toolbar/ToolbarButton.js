/**
 * Toolbar button component
 */
import { createButton } from '../../utils/dom.js';
export class ToolbarButton {
    constructor(config, onClick) {
        this.isActive = false;
        this.button = createButton(config.icon ?? config.label, 'toolbar-button', onClick, config.label);
        this.button.setAttribute('data-command', config.command);
        this.button.setAttribute('data-button-id', config.id);
    }
    getElement() {
        return this.button;
    }
    setActive(active) {
        this.isActive = active;
        if (active) {
            this.button.classList.add('active');
        }
        else {
            this.button.classList.remove('active');
        }
    }
    setDisabled(disabled) {
        this.button.disabled = disabled;
    }
    isButtonActive() {
        return this.isActive;
    }
}
//# sourceMappingURL=ToolbarButton.js.map