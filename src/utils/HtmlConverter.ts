/**
 * HTML Converter - converts editor content to HTML with inline styles for preview
 */

export class HtmlConverter {
  /**
   * Convert contenteditable element content to HTML with inline styles
   */
  public static convertToHtml(element: HTMLElement): string {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!element) {
      return '';
    }

    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Process all elements and preserve styles
    this.processElement(clonedElement);

    // Get the HTML content
    const html = clonedElement.innerHTML;

    return html;
  }

  /**
   * Process element and ensure styles are preserved as inline styles
   */
  private static processElement(element: HTMLElement): void {
    // First, convert semantic tags (u, b, strong, i, em) to inline styles
    this.convertSemanticTags(element);

    // Then process all elements to ensure inline styles are applied
    const allElements = element.querySelectorAll('*') as NodeListOf<HTMLElement>;

    // Also include the element itself
    const elementsToProcess: HTMLElement[] = [element];
    allElements.forEach((el) => elementsToProcess.push(el));

    for (const el of elementsToProcess) {
      const computed = window.getComputedStyle(el);
      this.applyInlineStyles(el, computed);
    }
  }

  /**
   * Apply inline styles to element based on computed styles
   */
  private static applyInlineStyles(element: HTMLElement, computed: CSSStyleDeclaration): void {
    this.applyFontStyles(element, computed);
    this.applyTextDecoration(element, computed);
    this.applyTextStyles(element, computed);
    this.applyColorStyles(element, computed);
    this.applyLayoutStyles(element, computed);
  }

  /**
   * Apply font-related styles (weight, style, size, family)
   */
  private static applyFontStyles(element: HTMLElement, computed: CSSStyleDeclaration): void {
    if (computed.fontWeight === 'bold' || parseInt(computed.fontWeight) >= 700) {
      element.style.fontWeight = 'bold';
    }

    if (computed.fontStyle === 'italic') {
      element.style.fontStyle = 'italic';
    }

    if (computed.fontSize && computed.fontSize !== 'inherit') {
      element.style.fontSize = computed.fontSize;
    }

    if (computed.fontFamily && computed.fontFamily !== 'inherit') {
      element.style.fontFamily = computed.fontFamily;
    }
  }

  /**
   * Apply text decoration styles (underline, line-through)
   */
  private static applyTextDecoration(element: HTMLElement, computed: CSSStyleDeclaration): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const textDecoration = computed.textDecoration ?? '';
    if (textDecoration.includes('underline')) {
      element.style.textDecoration = 'underline';
    } else if (textDecoration.includes('line-through')) {
      element.style.textDecoration = 'line-through';
    }
  }

  /**
   * Apply text alignment styles
   */
  private static applyTextStyles(element: HTMLElement, computed: CSSStyleDeclaration): void {
    if (computed.textAlign && computed.textAlign !== 'start') {
      element.style.textAlign = computed.textAlign;
    }
  }

  /**
   * Apply color and background color styles
   */
  private static applyColorStyles(element: HTMLElement, computed: CSSStyleDeclaration): void {
    if (computed.color && computed.color !== 'inherit' && computed.color !== 'rgb(0, 0, 0)') {
      element.style.color = computed.color;
    }

    const bgColor = computed.backgroundColor;
    if (bgColor &&
        bgColor !== 'rgba(0, 0, 0, 0)' &&
        bgColor !== 'transparent' &&
        bgColor !== 'inherit') {
      element.style.backgroundColor = bgColor;
    }
  }

  /**
   * Apply layout-related styles
   */
  private static applyLayoutStyles(_element: HTMLElement, _computed: CSSStyleDeclaration): void {
    // Placeholder for future layout style applications
  }

  /**
   * Convert semantic tags (u, b, strong, i, em) to span tags with inline styles
   */
  private static convertSemanticTags(element: HTMLElement): void {
    // Process in reverse order to avoid index issues when replacing
    const semanticTags = ['u', 'b', 'strong', 'i', 'em'];

    semanticTags.forEach((tagName) => {
      const tags = Array.from(element.querySelectorAll(tagName)) as HTMLElement[];

      // Process in reverse to avoid index issues
      for (let i = tags.length - 1; i >= 0; i--) {
        const tag = tags[i];
        const span = document.createElement('span');

        // Copy all existing styles
        if (tag.style.cssText) {
          span.style.cssText = tag.style.cssText;
        }

        // Apply specific style based on tag type
        switch (tagName) {
          case 'u':
            span.style.textDecoration = 'underline';
            break;
          case 'b':
          case 'strong':
            span.style.fontWeight = 'bold';
            break;
          case 'i':
          case 'em':
            span.style.fontStyle = 'italic';
            break;
        }

        // Copy all attributes (except style which we handle separately)
        Array.from(tag.attributes).forEach((attr) => {
          if (attr.name !== 'style') {
            span.setAttribute(attr.name, attr.value);
          }
        });

        // Move all children
        while (tag.firstChild) {
          span.appendChild(tag.firstChild);
        }

        // Replace the tag with span
        tag.parentNode?.replaceChild(span, tag);
      }
    });

    // Also handle direct children that are semantic tags
    const children = Array.from(element.children) as HTMLElement[];
    children.forEach((child) => {
      const tagName = child.tagName.toLowerCase();
      if (semanticTags.includes(tagName)) {
        const span = document.createElement('span');

        // Copy all existing styles
        if (child.style.cssText) {
          span.style.cssText = child.style.cssText;
        }

        // Apply specific style
        switch (tagName) {
          case 'u':
            span.style.textDecoration = 'underline';
            break;
          case 'b':
          case 'strong':
            span.style.fontWeight = 'bold';
            break;
          case 'i':
          case 'em':
            span.style.fontStyle = 'italic';
            break;
        }

        // Move all children
        while (child.firstChild) {
          span.appendChild(child.firstChild);
        }

        // Replace
        element.replaceChild(span, child);
      }
    });
  }

}

