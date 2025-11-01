/**
 * Font controls component (Family only)
 */

import { createSelect } from '../../utils/dom.js';
import {
  FONT_FAMILIES,
} from '../../utils/constants.js';
import type { TextFormat } from '../../types/editor.types.js';

export class FontControls {
  private fontFamilySelect: HTMLSelectElement;
  private onFontFamilyChange: (family: string) => void;

  constructor(
    onFontFamilyChange: (family: string) => void,
  ) {
    this.onFontFamilyChange = onFontFamilyChange;

    this.fontFamilySelect = this.createFontFamilySelect();
  }

  public getElements(): HTMLElement[] {
    return [this.fontFamilySelect];
  }

  private createFontFamilySelect(): HTMLSelectElement {
    const options = FONT_FAMILIES.map((family) => ({
      value: family.value,
      label: family.name,
    }));

    const select = createSelect(
      'toolbar-select',
      options,
      (value) => this.onFontFamilyChange(value),
      'Font Family',
    );
    select.className = 'toolbar-select';
    return select;
  }

  public updateFormat(format: TextFormat): void {
    if (format.fontFamily) {
      // Normalize font family to match dropdown values
      // Computed fontFamily might be like "Arial, sans-serif" or 'Arial, "Helvetica Neue", sans-serif'
      // We need to extract the first font name and match it with our options
      const normalizedFontFamily = this.normalizeFontFamily(format.fontFamily);

      // Try to find matching option in dropdown
      const matchingOption = Array.from(this.fontFamilySelect.options).find(
        (option) => option.value === normalizedFontFamily ||
                    option.value.toLowerCase() === normalizedFontFamily.toLowerCase(),
      );

      if (matchingOption) {
        this.fontFamilySelect.value = matchingOption.value;
      } else {
        // If no exact match, try to find by first font name
        const firstFontName = normalizedFontFamily.split(',')[0].trim().toLowerCase();
        const matchingByFirst = Array.from(this.fontFamilySelect.options).find(
          (option) => option.value.toLowerCase().includes(firstFontName) ||
                      firstFontName.includes(option.value.toLowerCase()),
        );
        if (matchingByFirst) {
          this.fontFamilySelect.value = matchingByFirst.value;
        }
      }
    }
  }

  private normalizeFontFamily(fontFamily: string): string {
    // Remove quotes and extract first font name
    let normalized = fontFamily.trim();

    // Remove surrounding quotes if present
    normalized = normalized.replace(/^["']|["']$/g, '');

    // Get the first font name before comma
    const firstFont = normalized.split(',')[0].trim();

    // Remove quotes from individual font names
    return firstFont.replace(/["']/g, '').trim();
  }
}

