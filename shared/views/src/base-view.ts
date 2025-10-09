// Base view class for all application views
export abstract class BaseView {
  protected container: HTMLElement;
  protected isRendered = false;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  abstract render(): void;
  abstract destroy(): void;

  protected createElement(tag: string, className?: string, textContent?: string): HTMLElement {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
  }

  protected createButton(text: string, className: string = 'btn', onClick?: (e: Event) => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    if (onClick) button.addEventListener('click', onClick);
    return button;
  }

  protected createInput(type: string, placeholder?: string, className: string = ''): HTMLInputElement {
    const input = document.createElement('input');
    input.type = type;
    if (placeholder) input.placeholder = placeholder;
    if (className) input.className = className;
    return input;
  }

  protected createFormGroup(labelText: string, input: HTMLElement): HTMLElement {
    const group = this.createElement('div', 'form-group');
    const label = this.createElement('label', '', labelText);
    group.appendChild(label);
    group.appendChild(input);
    return group;
  }

  protected show() {
    this.container.style.display = 'block';
  }

  protected hide() {
    this.container.style.display = 'none';
  }

  protected clear() {
    this.container.innerHTML = '';
  }
}