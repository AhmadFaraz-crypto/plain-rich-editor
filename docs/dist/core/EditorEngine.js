/**
 * Core editor engine - handles all text manipulation and formatting
 */
export class EditorEngine {
    constructor(initialState) {
        this.state = initialState ?? this.createInitialState();
    }
    createInitialState() {
        return {
            content: [
                {
                    id: this.generateId(),
                    type: 'paragraph',
                    content: '',
                    format: this.getDefaultFormat(),
                },
            ],
            selection: null,
            activeFormat: this.getDefaultFormat(),
            history: [],
            historyIndex: -1,
        };
    }
    generateId() {
        return `para_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    getDefaultFormat() {
        return {
            bold: false,
            italic: false,
            underline: false,
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
            color: '#000000',
            backgroundColor: 'transparent',
            alignment: 'left',
        };
    }
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }
    setState(newState) {
        this.saveToHistory();
        this.state = newState;
    }
    updateSelection(range) {
        this.state.selection = range;
        this.updateActiveFormat();
    }
    updateActiveFormat() {
        if (!this.state.selection) {
            return;
        }
        const { start } = this.state.selection;
        let currentPos = 0;
        let activeFormat = this.getDefaultFormat();
        for (const paragraph of this.state.content) {
            const paragraphLength = paragraph.content.length + 1; // +1 for paragraph break
            if (currentPos <= start && start < currentPos + paragraphLength) {
                activeFormat = { ...paragraph.format };
                break;
            }
            currentPos += paragraphLength;
        }
        this.state.activeFormat = activeFormat;
    }
    insertText(text, position) {
        this.saveToHistory();
        if (position === undefined) {
            position = this.getCursorPosition();
        }
        if (position < 0) {
            position = 0;
        }
        let currentPos = 0;
        let inserted = false;
        for (let i = 0; i < this.state.content.length; i++) {
            const paragraph = this.state.content[i];
            const paragraphLength = paragraph.content.length + 1;
            if (currentPos <= position && position < currentPos + paragraphLength) {
                const localPos = position - currentPos;
                const before = paragraph.content.substring(0, localPos);
                const after = paragraph.content.substring(localPos);
                const lines = (before + text + after).split('\n');
                // Update current paragraph with first line
                paragraph.content = lines[0];
                // Insert new paragraphs for remaining lines
                for (let j = 1; j < lines.length; j++) {
                    const newParagraph = {
                        id: this.generateId(),
                        type: 'paragraph',
                        content: lines[j],
                        format: { ...paragraph.format },
                    };
                    this.state.content.splice(i + j, 0, newParagraph);
                }
                inserted = true;
                break;
            }
            currentPos += paragraphLength;
        }
        if (!inserted) {
            // Insert at end
            const lastParagraph = this.state.content[this.state.content.length - 1];
            lastParagraph.content += text;
        }
        // Update selection
        const newPosition = position + text.length;
        this.state.selection = { start: newPosition, end: newPosition };
    }
    deleteText(range) {
        this.saveToHistory();
        if (!range) {
            range = this.state.selection ?? { start: 0, end: 0 };
        }
        const { start, end } = range;
        const length = end - start;
        if (length <= 0) {
            return;
        }
        let currentPos = 0;
        let deleted = false;
        for (let i = 0; i < this.state.content.length; i++) {
            const paragraph = this.state.content[i];
            const paragraphLength = paragraph.content.length + 1;
            if (currentPos <= start && start < currentPos + paragraphLength) {
                const localStart = start - currentPos;
                const localEnd = Math.min(end - currentPos, paragraph.content.length);
                paragraph.content =
                    paragraph.content.substring(0, localStart) +
                        paragraph.content.substring(localEnd);
                // Handle merging with next paragraph if needed
                if (localEnd >= paragraph.content.length && i < this.state.content.length - 1) {
                    paragraph.content += this.state.content[i + 1].content;
                    this.state.content.splice(i + 1, 1);
                }
                deleted = true;
                break;
            }
            currentPos += paragraphLength;
        }
        if (deleted) {
            this.state.selection = { start, end: start };
        }
    }
    applyFormat(format, range) {
        this.saveToHistory();
        if (!range) {
            range = this.state.selection ?? undefined;
        }
        if (!range) {
            // Apply to active format only (for next typing)
            this.state.activeFormat = { ...this.state.activeFormat, ...format };
            return;
        }
        const { start, end } = range;
        let currentPos = 0;
        for (const paragraph of this.state.content) {
            const paragraphLength = paragraph.content.length + 1;
            if (currentPos < end && currentPos + paragraphLength > start) {
                paragraph.format = { ...paragraph.format, ...format };
            }
            currentPos += paragraphLength;
        }
        // Update active format
        this.state.activeFormat = { ...this.state.activeFormat, ...format };
    }
    executeCommand(command) {
        switch (command.type) {
            case 'format':
                if (command.format && command.target) {
                    this.applyFormat(command.format, command.target);
                }
                break;
            case 'insert':
                if (command.text !== undefined) {
                    this.insertText(command.text, command.target?.start);
                }
                break;
            case 'delete':
                if (command.target) {
                    this.deleteText(command.target);
                }
                break;
            case 'paste':
                if (command.text !== undefined && command.target) {
                    this.deleteText(command.target);
                    this.insertText(command.text, command.target.start);
                }
                break;
        }
    }
    getCursorPosition() {
        if (this.state.selection) {
            return this.state.selection.end;
        }
        return 0;
    }
    saveToHistory() {
        // Limit history to 50 states
        if (this.state.history.length >= 50) {
            this.state.history.shift();
            this.state.historyIndex--;
        }
        // Remove any states after current index (when undoing and then making new changes)
        this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        // Save current state
        this.state.history.push(JSON.parse(JSON.stringify(this.state)));
        this.state.historyIndex = this.state.history.length - 1;
    }
    undo() {
        if (this.state.historyIndex > 0) {
            this.state.historyIndex--;
            this.state = JSON.parse(JSON.stringify(this.state.history[this.state.historyIndex]));
            return true;
        }
        return false;
    }
    redo() {
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.historyIndex++;
            this.state = JSON.parse(JSON.stringify(this.state.history[this.state.historyIndex]));
            return true;
        }
        return false;
    }
    canUndo() {
        return this.state.historyIndex > 0;
    }
    canRedo() {
        return this.state.historyIndex < this.state.history.length - 1;
    }
    getActiveFormat() {
        return { ...this.state.activeFormat };
    }
}
//# sourceMappingURL=EditorEngine.js.map