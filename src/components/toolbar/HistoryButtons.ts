/**
 * History buttons component (Undo, Redo)
 */

import { ToolbarButton } from './ToolbarButton.js';
import { TOOLBAR_ICONS } from '../../utils/constants.js';

export class HistoryButtons {
  private undoButton: ToolbarButton;
  private redoButton: ToolbarButton;
  private onUndo: () => void;
  private onRedo: () => void;

  constructor(onUndo: () => void, onRedo: () => void) {
    this.onUndo = onUndo;
    this.onRedo = onRedo;

    this.undoButton = new ToolbarButton(
      {
        id: 'undo',
        label: 'Undo',
        command: 'undo',
        icon: TOOLBAR_ICONS.undo,
      },
      () => this.onUndo(),
    );

    this.redoButton = new ToolbarButton(
      {
        id: 'redo',
        label: 'Redo',
        command: 'redo',
        icon: TOOLBAR_ICONS.redo,
      },
      () => this.onRedo(),
    );
  }

  public getButtons(): ToolbarButton[] {
    return [this.undoButton, this.redoButton];
  }

  public updateState(canUndo: boolean, canRedo: boolean): void {
    this.undoButton.setDisabled(!canUndo);
    this.redoButton.setDisabled(!canRedo);
  }
}

