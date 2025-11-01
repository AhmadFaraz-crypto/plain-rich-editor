/**
 * Content renderer - converts editor state to HTML
 */

import type { EditorState, ParagraphNode, TextFormat } from '../../types/editor.types.js';

export class ContentRenderer {
  public render(state: EditorState): string {
    return state.content
      .map((paragraph) => this.renderParagraph(paragraph))
      .join('');
  }

  private renderParagraph(paragraph: ParagraphNode): string {
    const style = this.formatToStyle(paragraph.format);
    const className = this.formatToClassName(paragraph.format);

    let content = this.escapeHtml(paragraph.content);

    // Apply formatting in correct order (underline, italic, bold)
    if (paragraph.format.underline) {
      content = `<u>${content}</u>`;
    }
    if (paragraph.format.italic) {
      content = `<em>${content}</em>`;
    }
    if (paragraph.format.bold) {
      content = `<strong>${content}</strong>`;
    }

    return `<p data-id="${paragraph.id}" style="${style}" class="${className}">${content}</p>`;
  }

  private formatToStyle(format: TextFormat): string {
    const styles: string[] = [];

    if (format.fontSize) {
      styles.push(`font-size: ${format.fontSize}pt`);
    }
    if (format.fontFamily) {
      styles.push(`font-family: ${format.fontFamily}`);
    }
    if (format.color) {
      styles.push(`color: ${format.color}`);
    }
    if (format.backgroundColor && format.backgroundColor !== 'transparent') {
      styles.push(`background-color: ${format.backgroundColor}`);
    }
    if (format.alignment) {
      styles.push(`text-align: ${format.alignment}`);
    }

    return styles.join('; ');
  }

  private formatToClassName(format: TextFormat): string {
    const classes: string[] = [];

    if (format.bold) {classes.push('format-bold');}
    if (format.italic) {classes.push('format-italic');}
    if (format.underline) {classes.push('format-underline');}

    return classes.join(' ');
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

