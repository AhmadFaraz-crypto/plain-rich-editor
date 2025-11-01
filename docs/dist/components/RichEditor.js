/**
 * RichEditor - A rich text editor built with plain TypeScript
 *
 * This is the main editor class that orchestrates all editor functionality including
 * toolbar, content area, formatting, and HTML preview. It provides a clean API for
 * creating and managing a rich text editing experience.
 *
 * @example
 * ```typescript
 * const container = document.getElementById('editor');
 * const editor = new RichEditor(container);
 * editor.render();
 * ```
 *
 * @public
 */
import { EditorEngine } from '../core/EditorEngine.js';
import { SelectionManager } from '../core/SelectionManager.js';
import { ExtensionManager } from '../core/ExtensionManager.js';
import { Toolbar } from './toolbar/Toolbar.js';
import { EditorContent } from './EditorContent.js';
import { HtmlPreviewManager } from './preview/HtmlPreviewManager.js';
import { FormatStateManager } from './format/FormatStateManager.js';
import { PasteHandler } from './paste/PasteHandler.js';
import { CommandHandler } from './commands/CommandHandler.js';
export class RichEditor {
    /**
     * Creates a new RichEditor instance
     *
     * @param container - The HTML element that will contain the editor
     * @param options - Configuration options for the editor
     * @throws {Error} If container is not a valid HTMLElement
     *
     * @example
     * ```typescript
     * const editor = new RichEditor(document.getElementById('editor'), {
     *   initialContent: '<p>Hello World</p>',
     *   onContentChange: (content) => console.log(content),
     * });
     * editor.render();
     * ```
     */
    constructor(container, options = {}) {
        this.toolbar = null;
        this.content = null;
        this.selectionManager = null;
        this.isComposing = false;
        this.isRendering = false;
        this.htmlPreviewTimer = null;
        this.container = container;
        this.options = {
            initialContent: '',
            readonly: false,
            showHtmlPreview: true,
            initialViewMode: 'editor',
            ...options,
        };
        this.engine = new EditorEngine();
        // Initialize extension manager
        this.extensionManager = new ExtensionManager();
        // Register extensions if provided
        if (this.options.extensions) {
            this.options.extensions.forEach((extension) => {
                this.extensionManager.register(extension);
            });
        }
        // Create structure
        this.createStructure();
        // Initialize managers
        this.htmlPreviewManager = new HtmlPreviewManager(this.htmlPreviewContainer, this.htmlPreviewContent, this.htmlPreviewCode);
        // Initialize components
        this.initializeToolbar();
        this.initializeContent();
        this.initializeSelectionManager();
        // Set initial content if provided
        if (this.options.initialContent) {
            // Set after render, so we do it after initial render
        }
        // Initial render
        this.render();
        // Set initial content and view mode after render
        if (this.options.initialContent) {
            this.setContent(this.options.initialContent);
        }
        // Set initial view mode
        if (this.options.initialViewMode && this.options.initialViewMode !== 'editor') {
            this.setViewMode(this.options.initialViewMode);
        }
        // Set editor instance for extensions (after everything is initialized)
        this.extensionManager.setEditor(this.createEditorInstance());
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    /**
     * Creates an editor instance interface for extensions
     */
    createEditorInstance() {
        return {
            getContent: () => this.getContent(),
            setContent: (html) => this.setContent(html),
            getState: () => this.getState(),
            focus: () => this.focus(),
            executeCommand: (command, value) => this.handleCommand(command, value),
            getContainer: () => this.container,
            getContentElement: () => this.content?.getContainer() ?? this.contentContainer,
            getSelection: () => {
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    return {
                        start: range.startOffset,
                        end: range.endOffset,
                    };
                }
                return null;
            },
        };
    }
    createStructure() {
        this.container.className = 'rich-editor';
        // Create main content wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'editor-wrapper';
        // Toolbar on top (horizontal)
        this.toolbarContainer = document.createElement('div');
        this.toolbarContainer.className = 'editor-toolbar-container';
        // Content area wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'editor-content-wrapper';
        // Editor content area
        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'editor-content-container';
        // Ensure editor is visible by default
        this.contentContainer.style.display = 'flex';
        // HTML preview area (hidden by default)
        this.htmlPreviewContainer = document.createElement('div');
        this.htmlPreviewContainer.className = 'html-preview-container';
        this.htmlPreviewContainer.style.display = 'none';
        const previewHeader = document.createElement('div');
        previewHeader.className = 'html-preview-header';
        // Header title on the left
        const headerTitle = document.createElement('span');
        headerTitle.textContent = 'HTML Output';
        headerTitle.style.flex = '1';
        const previewTabs = document.createElement('div');
        previewTabs.className = 'html-preview-tabs';
        const previewTab = document.createElement('button');
        previewTab.className = 'html-preview-tab active';
        previewTab.textContent = 'Preview';
        previewTab.setAttribute('data-tab', 'preview');
        previewTab.type = 'button';
        const codeTab = document.createElement('button');
        codeTab.className = 'html-preview-tab';
        codeTab.textContent = 'Code';
        codeTab.setAttribute('data-tab', 'code');
        codeTab.type = 'button';
        previewTabs.appendChild(previewTab);
        previewTabs.appendChild(codeTab);
        previewHeader.appendChild(headerTitle);
        previewHeader.appendChild(previewTabs);
        const previewBody = document.createElement('div');
        previewBody.className = 'html-preview-body';
        // Preview content area
        this.htmlPreviewContent = document.createElement('div');
        this.htmlPreviewContent.className = 'html-preview-content active';
        this.htmlPreviewContent.setAttribute('data-view', 'preview');
        // Code view area
        this.htmlPreviewCode = document.createElement('pre');
        this.htmlPreviewCode.className = 'html-preview-code';
        this.htmlPreviewCode.setAttribute('data-view', 'code');
        const codeText = document.createElement('code');
        codeText.className = 'language-html';
        this.htmlPreviewCode.appendChild(codeText);
        previewBody.appendChild(this.htmlPreviewContent);
        previewBody.appendChild(this.htmlPreviewCode);
        this.htmlPreviewContainer.appendChild(previewHeader);
        this.htmlPreviewContainer.appendChild(previewBody);
        // Tab switching
        previewTab.addEventListener('click', () => {
            previewTab.classList.add('active');
            codeTab.classList.remove('active');
            this.htmlPreviewContent.classList.add('active');
            this.htmlPreviewCode.classList.remove('active');
        });
        codeTab.addEventListener('click', () => {
            codeTab.classList.add('active');
            previewTab.classList.remove('active');
            this.htmlPreviewCode.classList.add('active');
            this.htmlPreviewContent.classList.remove('active');
        });
        contentWrapper.appendChild(this.contentContainer);
        contentWrapper.appendChild(this.htmlPreviewContainer);
        wrapper.appendChild(this.toolbarContainer);
        wrapper.appendChild(contentWrapper);
        this.container.appendChild(wrapper);
    }
    initializeToolbar() {
        this.toolbar = new Toolbar(this.toolbarContainer, (command, value) => {
            this.handleCommand(command, value);
        }, this.options.showHtmlPreview !== false
            ? (mode) => {
                this.setViewMode(mode);
            }
            : undefined, this.options.toolbar);
        // Add extension toolbar elements
        const extensionElements = this.extensionManager.getToolbarElements();
        if (extensionElements.length > 0 && this.toolbarContainer) {
            extensionElements.forEach((element) => {
                this.toolbarContainer.appendChild(element);
            });
        }
    }
    setViewMode(mode) {
        // Ensure containers exist
        if (!this.htmlPreviewContainer.parentNode || !this.contentContainer.parentNode) {
            return;
        }
        if (mode === 'editor') {
            // Editor only - hide preview
            this.htmlPreviewManager.hide();
            this.contentContainer.style.display = 'flex';
            this.contentContainer.style.removeProperty('width');
        }
        else if (mode === 'preview') {
            // Preview only - hide editor
            this.contentContainer.style.display = 'none';
            this.htmlPreviewManager.show();
            this.htmlPreviewContainer.style.removeProperty('width');
            // Update HTML preview content
            this.htmlPreviewManager.update();
        }
        else {
            // Both - show side by side
            this.contentContainer.style.display = 'flex';
            this.contentContainer.style.width = '50%';
            this.htmlPreviewManager.show();
            this.htmlPreviewContainer.style.width = '50%';
            this.htmlPreviewContainer.style.display = 'flex';
            // Update HTML preview content
            this.htmlPreviewManager.update();
        }
    }
    updateHtmlPreviewNow() {
        this.htmlPreviewManager.update();
    }
    initializeContent() {
        this.content = new EditorContent(this.contentContainer, (text) => this.handleInput(text), (event) => this.handleKeyDown(event), (content, isHtml) => this.handlePaste(content, isHtml));
        // Initialize managers that need content
        const contentElement = this.content.getContainer();
        this.formatStateManager = new FormatStateManager((format) => {
            if (this.toolbar) {
                this.toolbar.updateActiveFormat(format);
            }
            // Call onFormatChange callback if provided
            if (this.options.onFormatChange) {
                this.options.onFormatChange(format);
            }
        });
        // Set content element for format state manager
        this.formatStateManager.setContentElement(contentElement);
        this.pasteHandler = new PasteHandler(contentElement, this.engine);
        this.commandHandler = new CommandHandler(contentElement, () => {
            // Use requestAnimationFrame to ensure DOM is updated before checking format
            requestAnimationFrame(() => {
                // Force immediate update after format commands to reflect toggle state
                this.formatStateManager.update(true);
            });
        });
        // Set content element for HTML preview
        this.htmlPreviewManager.setContentElement(contentElement);
    }
    initializeSelectionManager() {
        if (!this.content) {
            return;
        }
        this.selectionManager = new SelectionManager(this.content.getContainer(), (range) => {
            this.engine.updateSelection(range);
            this.updateUI();
            // Also update format state based on selection (debounced)
            this.formatStateManager.debouncedUpdate();
        });
        // Listen for selection changes (mouseup, keyup, etc.) - debounced
        const contentElement = this.content.getContainer();
        contentElement.addEventListener('mouseup', () => {
            // Ensure focus is maintained after mouse up
            if (document.activeElement !== contentElement) {
                contentElement.focus();
            }
            this.formatStateManager.debouncedUpdate();
            // Also update HTML preview if selection changes
            setTimeout(() => this.updateHtmlPreviewOnSelectionChange(), 100);
        });
        contentElement.addEventListener('keyup', () => {
            // Ensure focus is maintained after key up
            if (document.activeElement !== contentElement) {
                contentElement.focus();
            }
            this.formatStateManager.debouncedUpdate();
        });
        // Listen for selection change events - debounced
        document.addEventListener('selectionchange', () => {
            // Only update if selection is within the editor and editor has focus
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (contentElement.contains(range.commonAncestorContainer)) {
                    // Ensure editor has focus if selection is within it
                    if (document.activeElement !== contentElement) {
                        contentElement.focus();
                    }
                    this.formatStateManager.debouncedUpdate();
                    // Also update HTML preview if selection changes
                    setTimeout(() => this.updateHtmlPreviewOnSelectionChange(), 100);
                }
            }
        });
    }
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcut(e);
        });
    }
    handleKeyboardShortcut(event) {
        const hasModifier = event.ctrlKey || event.metaKey;
        if (!hasModifier) {
            return;
        }
        // Undo: Ctrl/Cmd + Z
        if (this.isUndoShortcut(event)) {
            event.preventDefault();
            this.handleCommand('undo');
            return;
        }
        // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
        if (this.isRedoShortcut(event)) {
            event.preventDefault();
            this.handleCommand('redo');
            return;
        }
        // Bold: Ctrl/Cmd + B
        if (this.isBoldShortcut(event)) {
            event.preventDefault();
            this.handleCommand('bold');
            return;
        }
        // Italic: Ctrl/Cmd + I
        if (this.isItalicShortcut(event)) {
            event.preventDefault();
            this.handleCommand('italic');
            return;
        }
        // Underline: Ctrl/Cmd + U
        if (this.isUnderlineShortcut(event)) {
            event.preventDefault();
            this.handleCommand('underline');
            return;
        }
    }
    isUndoShortcut(event) {
        return event.key === 'z' && !event.shiftKey;
    }
    isRedoShortcut(event) {
        return (event.shiftKey && event.key === 'z') || event.key === 'y';
    }
    isBoldShortcut(event) {
        return event.key === 'b';
    }
    isItalicShortcut(event) {
        return event.key === 'i';
    }
    isUnderlineShortcut(event) {
        return event.key === 'u';
    }
    handleCommand(command, value) {
        if (!this.content) {
            return;
        }
        // Try extensions first
        if (this.extensionManager.executeCommand(command, value)) {
            return;
        }
        // Fall back to default command handler
        this.commandHandler.execute(command, value);
    }
    debouncedUpdateFormatState() {
        this.formatStateManager.debouncedUpdate();
    }
    handleInput(_text) {
        if (this.isComposing || this.isRendering) {
            return;
        }
        // Handle input through extensions
        this.extensionManager.handleInput(_text);
        // Sync selection from DOM to keep state up to date
        if (this.selectionManager) {
            // Update selection from current DOM state
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                this.selectionManager.handleSelectionChange();
            }
        }
        // Clear format state cache during typing so it always checks current position
        // Then update format state after input (debounced) to reflect actual format at cursor
        this.formatStateManager.clearCache();
        this.formatStateManager.debouncedUpdate();
        // Auto-update HTML preview (debounced)
        this.debouncedUpdateHtmlPreview();
        // Call onContentChange callback if provided - always get fresh content from DOM
        if (this.options.onContentChange) {
            // Use setTimeout to ensure DOM is fully updated after input event
            const callback = this.options.onContentChange;
            setTimeout(() => {
                const content = this.getContent();
                callback(content);
            }, 0);
        }
        // Don't try to update content - contenteditable manages its own content
        // We just need to keep selection state in sync
    }
    debouncedUpdateHtmlPreview() {
        // Only update if HTML view is currently active
        if (!this.htmlPreviewManager.isVisible()) {
            return;
        }
        if (this.htmlPreviewTimer !== null) {
            window.clearTimeout(this.htmlPreviewTimer);
        }
        this.htmlPreviewTimer = window.setTimeout(() => {
            if (this.content) {
                this.htmlPreviewManager.update();
            }
            this.htmlPreviewTimer = null;
        }, 500); // Update preview after 500ms of inactivity
    }
    updateHtmlPreviewOnSelectionChange() {
        // Update HTML preview when selection changes (only if HTML view is active)
        if (this.htmlPreviewManager.isVisible() && this.content) {
            this.htmlPreviewManager.update();
        }
    }
    handleKeyDown(event) {
        // Handle composition (IME input)
        if (event.key === 'Process') {
            this.isComposing = true;
            return;
        }
        this.isComposing = false;
        // Try extensions first
        if (this.extensionManager.handleKeyDown(event)) {
            event.preventDefault();
            return;
        }
        // For delete/backspace, schedule immediate HTML preview update after the deletion
        if ((event.key === 'Backspace' || event.key === 'Delete') && this.htmlPreviewManager.isVisible() && this.content) {
            // Use a shorter timeout to update preview immediately after deletion
            setTimeout(() => {
                this.htmlPreviewManager.update();
            }, 50); // Small delay to ensure DOM is updated
        }
        // Let all keys (Enter, Backspace, Delete, etc.) be handled naturally by contenteditable
        // We'll sync the state after the input event
        // Don't prevent default or manually manage keys
    }
    handlePaste(content, isHtml) {
        if (!this.content) {
            return;
        }
        // Try extensions first
        if (this.extensionManager.handlePaste(content, isHtml)) {
            return;
        }
        // Transform content through extensions
        const transformedContent = this.extensionManager.transformContent(content, isHtml);
        this.pasteHandler.handle(transformedContent, isHtml, () => {
            setTimeout(() => {
                this.formatStateManager.debouncedUpdate();
            }, 10);
        });
        // If it's plain text, we need to render
        if (!isHtml) {
            this.render();
        }
    }
    getCursorPosition() {
        const state = this.engine.getState();
        return state.selection?.end ?? 0;
    }
    render() {
        if (this.isRendering) {
            return; // Prevent recursive rendering
        }
        this.isRendering = true;
        const state = this.engine.getState();
        if (this.content) {
            this.content.render(state);
        }
        if (this.toolbar) {
            this.toolbar.updateActiveFormat(state.activeFormat);
        }
        this.updateUI();
        // Use requestAnimationFrame to ensure rendering completes
        requestAnimationFrame(() => {
            this.isRendering = false;
        });
    }
    updateUI() {
        // Additional UI updates if needed
        const state = this.engine.getState();
        if (this.toolbar) {
            this.toolbar.updateActiveFormat(state.activeFormat);
        }
    }
    /**
     * Focuses the editor content area
     *
     * @example
     * ```typescript
     * editor.focus();
     * ```
     */
    focus() {
        if (this.content) {
            this.content.focus();
        }
    }
    /**
     * Gets the current HTML content of the editor
     *
     * @returns The current HTML content as a string
     *
     * @example
     * ```typescript
     * const content = editor.getContent();
     * console.log(content); // '<p>Hello World</p>'
     * ```
     */
    getContent() {
        if (!this.content) {
            return '';
        }
        return this.content.getContainer().innerHTML;
    }
    /**
     * Sets the HTML content of the editor
     *
     * @param html - HTML content to set
     *
     * @example
     * ```typescript
     * editor.setContent('<p>Hello World</p>');
     * ```
     */
    setContent(html) {
        if (!this.content) {
            return;
        }
        const contentElement = this.content.getContainer();
        contentElement.innerHTML = html;
        // Update engine state
        this.engine = new EditorEngine();
        this.render();
    }
    /**
     * Gets the current editor state
     *
     * @returns The current editor state including content and formatting
     *
     * @example
     * ```typescript
     * const state = editor.getState();
     * console.log(state.content);
     * ```
     */
    getState() {
        return this.engine.getState();
    }
    /**
     * Sets the editor state
     *
     * @param state - The editor state to set
     *
     * @example
     * ```typescript
     * editor.setState({ content: '<p>New content</p>', selection: null });
     * ```
     */
    setState(state) {
        this.engine.setState(state);
        this.render();
    }
    /**
     * Destroys the editor instance and cleans up resources
     *
     * @example
     * ```typescript
     * editor.destroy();
     * ```
     */
    destroy() {
        if (this.selectionManager) {
            this.selectionManager.destroy();
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this.formatStateManager) {
            this.formatStateManager.destroy();
        }
        if (this.extensionManager) {
            this.extensionManager.destroy();
        }
        if (this.htmlPreviewTimer !== null) {
            window.clearTimeout(this.htmlPreviewTimer);
        }
    }
    /**
     * Registers an extension with the editor
     * @param extension - The extension to register
     *
     * @example
     * ```typescript
     * editor.registerExtension({
     *   id: 'my-extension',
     *   name: 'My Extension',
     *   onInit: () => console.log('Extension initialized')
     * });
     * ```
     */
    registerExtension(extension) {
        this.extensionManager.register(extension);
        // If editor is already initialized, call onRegister immediately
        if (this.content) {
            this.extensionManager.setEditor(this.createEditorInstance());
        }
    }
    /**
     * Unregisters an extension
     * @param extensionId - The extension ID to unregister
     */
    unregisterExtension(extensionId) {
        this.extensionManager.unregister(extensionId);
    }
}
//# sourceMappingURL=RichEditor.js.map