/**
 * Main Toolbar component - orchestrates all toolbar components
 */
import { ToolbarGroup } from './ToolbarGroup.js';
import { FormatButtons } from './FormatButtons.js';
import { FontControls } from './FontControls.js';
import { StyleDropdown } from './StyleDropdown.js';
import { createButton } from '../../utils/dom.js';
export class Toolbar {
    constructor(container, onCommand, onToggleHtmlView, toolbarOptions) {
        this.viewMode = 'editor';
        this.container = container;
        this.onToggleHtmlView = onToggleHtmlView;
        this.toolbarOptions = {
            showFormatButtons: true,
            showFontFamily: true,
            showStyleDropdown: true,
            ...toolbarOptions,
        };
        // Keep the container class from parent (editor-toolbar-container)
        // Don't override it, just ensure it's using flex
        if (!this.container.classList.contains('editor-toolbar-container')) {
            this.container.className = 'editor-toolbar-container';
        }
        // Initialize components - only what we need (conditionally)
        if (this.toolbarOptions.showStyleDropdown !== false) {
            this.styleDropdown = new StyleDropdown((style) => onCommand('text-style', style));
        }
        if (this.toolbarOptions.showFormatButtons !== false) {
            this.formatButtons = new FormatButtons((cmd) => onCommand(cmd), this.toolbarOptions.formatButtons);
        }
        if (this.toolbarOptions.showFontFamily !== false) {
            this.fontControls = new FontControls((family) => onCommand('font-family', family));
        }
        // Three separate view mode buttons
        this.editorButton = createButton('Editor', 'toolbar-button', () => {
            this.viewMode = 'editor';
            this.updateViewButtons();
            if (this.onToggleHtmlView) {
                this.onToggleHtmlView('editor');
            }
        }, 'Editor View');
        this.editorButton.setAttribute('data-button-id', 'view-editor');
        this.editorButton.classList.add('html-toggle-button');
        this.previewButton = createButton('Preview', 'toolbar-button', () => {
            this.viewMode = 'preview';
            this.updateViewButtons();
            if (this.onToggleHtmlView) {
                this.onToggleHtmlView('preview');
            }
        }, 'Preview View');
        this.previewButton.setAttribute('data-button-id', 'view-preview');
        this.previewButton.classList.add('html-toggle-button');
        this.bothButton = createButton('Both', 'toolbar-button', () => {
            this.viewMode = 'both';
            this.updateViewButtons();
            if (this.onToggleHtmlView) {
                this.onToggleHtmlView('both');
            }
        }, 'Both Views');
        this.bothButton.setAttribute('data-button-id', 'view-both');
        this.bothButton.classList.add('html-toggle-button');
        this.render();
    }
    updateViewButtons() {
        // Update active state for all buttons
        if (this.viewMode === 'editor') {
            this.editorButton.classList.add('active');
            this.previewButton.classList.remove('active');
            this.bothButton.classList.remove('active');
        }
        else if (this.viewMode === 'preview') {
            this.editorButton.classList.remove('active');
            this.previewButton.classList.add('active');
            this.bothButton.classList.remove('active');
        }
        else {
            // both
            this.editorButton.classList.remove('active');
            this.previewButton.classList.remove('active');
            this.bothButton.classList.add('active');
        }
    }
    setViewMode(mode) {
        this.viewMode = mode;
        this.updateViewButtons();
    }
    render() {
        this.container.innerHTML = '';
        // Keep horizontal layout, just remove unnecessary items
        // Font Style dropdown
        if (this.toolbarOptions.showStyleDropdown !== false && this.styleDropdown) {
            const styleGroup = new ToolbarGroup();
            styleGroup.addElement(this.styleDropdown.getElement());
            this.container.appendChild(styleGroup.getElement());
        }
        // Font Family control
        if (this.toolbarOptions.showFontFamily !== false && this.fontControls) {
            const fontControlsGroup = new ToolbarGroup();
            fontControlsGroup.addSeparator();
            const fontControlsElements = this.fontControls.getElements();
            fontControlsElements.forEach((element) => {
                fontControlsGroup.addElement(element);
            });
            this.container.appendChild(fontControlsGroup.getElement());
        }
        // Format buttons group (Bold, Italic, Underline)
        if (this.toolbarOptions.showFormatButtons !== false && this.formatButtons) {
            const formatGroup = new ToolbarGroup();
            formatGroup.addSeparator();
            const buttons = this.formatButtons.createButtons();
            // Filter buttons based on toolbar options
            buttons.forEach((button) => {
                const buttonId = button.getElement().getAttribute('data-button-id');
                const shouldShow = this.shouldShowFormatButton(buttonId);
                if (shouldShow) {
                    formatGroup.addElement(button.getElement());
                }
            });
            this.container.appendChild(formatGroup.getElement());
        }
        // View mode buttons group (Editor, Preview, Both) - only show if callback is provided
        if (this.onToggleHtmlView) {
            const viewButtonsGroup = new ToolbarGroup();
            viewButtonsGroup.addSeparator();
            viewButtonsGroup.addElement(this.editorButton);
            viewButtonsGroup.addElement(this.previewButton);
            viewButtonsGroup.addElement(this.bothButton);
            this.container.appendChild(viewButtonsGroup.getElement());
            // Set initial active state
            this.updateViewButtons();
        }
    }
    shouldShowFormatButton(buttonId) {
        if (!this.toolbarOptions.formatButtons || !buttonId) {
            return true; // Show by default if no specific config
        }
        return this.toolbarOptions.formatButtons[buttonId] !== false;
    }
    updateActiveFormat(format) {
        if (this.formatButtons) {
            this.formatButtons.updateFormat(format);
        }
        if (this.fontControls) {
            this.fontControls.updateFormat(format);
        }
    }
    updateUndoRedoState(_canUndo, _canRedo) {
        // No longer needed
    }
}
//# sourceMappingURL=Toolbar.js.map