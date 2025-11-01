/**
 * Format buttons component (Bold, Italic, Underline)
 */
import { ToolbarButton } from './ToolbarButton.js';
import { TOOLBAR_ICONS } from '../../utils/constants.js';
export class FormatButtons {
    constructor(onCommand, formatButtonConfig) {
        this.buttons = new Map();
        this.onCommand = onCommand;
        this.formatButtonConfig = formatButtonConfig;
    }
    createButtons() {
        const formatButtons = [
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
            const button = new ToolbarButton({
                id: type,
                label: type.charAt(0).toUpperCase() + type.slice(1),
                command: type,
                icon: TOOLBAR_ICONS[type],
            }, () => this.onCommand(type));
            this.buttons.set(type, button);
            return button;
        });
    }
    updateFormat(format) {
        this.buttons.get('bold')?.setActive(format.bold === true);
        this.buttons.get('italic')?.setActive(format.italic === true);
        this.buttons.get('underline')?.setActive(format.underline === true);
    }
}
//# sourceMappingURL=FormatButtons.js.map