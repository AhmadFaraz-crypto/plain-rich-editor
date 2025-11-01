/**
 * Alignment buttons component (Left, Center, Right, Justify)
 */
import { ToolbarButton } from './ToolbarButton.js';
import { TOOLBAR_ICONS } from '../../utils/constants.js';
export class AlignmentButtons {
    constructor(onCommand, alignmentButtonConfig) {
        this.buttons = new Map();
        this.onCommand = onCommand;
        this.alignmentButtonConfig = alignmentButtonConfig;
    }
    createButtons() {
        const alignments = ['left', 'center', 'right', 'justify'];
        return alignments
            .filter((alignment) => {
            // If config exists and button is explicitly set to false, hide it
            if (this.alignmentButtonConfig && this.alignmentButtonConfig[alignment] === false) {
                return false;
            }
            return true;
        })
            .map((alignment) => {
            const command = `align-${alignment}`;
            const button = new ToolbarButton({
                id: command,
                label: `Align ${alignment}`,
                command: command,
                icon: TOOLBAR_ICONS[command],
            }, () => this.onCommand(command));
            this.buttons.set(command, button);
            return button;
        });
    }
    updateFormat(format) {
        const alignment = format.alignment ?? 'left';
        this.buttons.forEach((button, id) => {
            const buttonAlignment = id.replace('align-', '');
            button.setActive(alignment === buttonAlignment);
        });
    }
}
//# sourceMappingURL=AlignmentButtons.js.map