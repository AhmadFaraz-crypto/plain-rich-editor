/**
 * DOM utility functions
 */
export const createElement = (tag, className, attributes) => {
    const element = document.createElement(tag);
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
export const createButton = (label, className, onClick, ariaLabel) => {
    const button = createElement('button', className);
    button.type = 'button';
    button.textContent = label;
    if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
    }
    button.addEventListener('click', onClick);
    return button;
};
export const createSelect = (className, options, onChange, ariaLabel) => {
    const select = createElement('select', className);
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
        const target = e.target;
        onChange(target.value);
    });
    return select;
};
export const createColorInput = (className, onChange, defaultValue = '#000000', ariaLabel) => {
    const input = createElement('input', className, {
        type: 'color',
    });
    input.value = defaultValue;
    if (ariaLabel) {
        input.setAttribute('aria-label', ariaLabel);
    }
    input.addEventListener('change', (e) => {
        const target = e.target;
        onChange(target.value);
    });
    return input;
};
//# sourceMappingURL=dom.js.map