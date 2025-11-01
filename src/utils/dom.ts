/**
 * DOM utility functions
 */

export const createElement = <T extends HTMLElement>(
  tag: string,
  className?: string,
  attributes?: Record<string, string>,
): T => {
  const element = document.createElement(tag) as T;

  if (className) {
    element.className = className;
  }

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
};

export const createButton = (
  label: string,
  className: string,
  onClick: () => void,
  ariaLabel?: string,
): HTMLButtonElement => {
  const button = createElement<HTMLButtonElement>('button', className);
  button.type = 'button';
  button.textContent = label;

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  button.addEventListener('click', onClick);
  return button;
};

export const createSelect = (
  className: string,
  options: Array<{ value: string; label: string }>,
  onChange: (value: string) => void,
  ariaLabel?: string,
): HTMLSelectElement => {
  const select = createElement<HTMLSelectElement>('select', className);

  if (ariaLabel) {
    select.setAttribute('aria-label', ariaLabel);
  }

  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    select.appendChild(optionElement);
  });

  select.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    onChange(target.value);
  });

  return select;
};

export const createColorInput = (
  className: string,
  onChange: (value: string) => void,
  defaultValue: string = '#000000',
  ariaLabel?: string,
): HTMLInputElement => {
  const input = createElement<HTMLInputElement>('input', className, {
    type: 'color',
  });
  input.value = defaultValue;

  if (ariaLabel) {
    input.setAttribute('aria-label', ariaLabel);
  }

  input.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    onChange(target.value);
  });

  return input;
};

