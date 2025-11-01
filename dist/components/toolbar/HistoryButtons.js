/**
 * History buttons component (Undo, Redo)
 */
import { ToolbarButton } from './ToolbarButton.js';
import { TOOLBAR_ICONS } from '../../utils/constants.js';
export class HistoryButtons {
    constructor(onUndo, onRedo) {
        this.onUndo = onUndo;
        this.onRedo = onRedo;
        this.undoButton = new ToolbarButton({
            id: 'undo',
            label: 'Undo',
            command: 'undo',
            icon: TOOLBAR_ICONS.undo,
        }, () => this.onUndo());
        this.redoButton = new ToolbarButton({
            id: 'redo',
            label: 'Redo',
            command: 'redo',
            icon: TOOLBAR_ICONS.redo,
        }, () => this.onRedo());
    }
    getButtons() {
        return [this.undoButton, this.redoButton];
    }
    updateState(canUndo, canRedo) {
        this.undoButton.setDisabled(!canUndo);
        this.redoButton.setDisabled(!canRedo);
    }
}
//# sourceMappingURL=HistoryButtons.js.map