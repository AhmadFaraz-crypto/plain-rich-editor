/**
 * Toolbar group component - groups related toolbar buttons
 */

import { createElement } from '../../utils/dom.js';

export class ToolbarGroup {
  private container: HTMLElement;
  private elements: HTMLElement[] = [];

  constructor() {
    this.container = createElement<HTMLDivElement>('div', 'toolbar-group');
  }

  public addElement(element: HTMLElement): void {
    this.elements.push(element);
    this.container.appendChild(element);
  }

  public addSeparator(): void {
    const separator = createElement<HTMLDivElement>('div', 'toolbar-separator');
    this.container.appendChild(separator);
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public clear(): void {
    this.container.innerHTML = '';
    this.elements = [];
  }
}

