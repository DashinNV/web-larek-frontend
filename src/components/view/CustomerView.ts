import { cloneTemplate, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

export class CustomerView {
  public template: HTMLElement;
  private submitButton: HTMLButtonElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private errorContainer: HTMLElement;
  private email: string;
  private phone: string;
  private events: EventEmitter;

  constructor(broker: EventEmitter) {
    this.events = broker;
    this.template = cloneTemplate('#contacts');
    this.submitButton = ensureElement<HTMLButtonElement>('.button', this.template);
    this.emailInput = ensureElement<HTMLInputElement>("[name='email']", this.template);
    this.phoneInput = ensureElement<HTMLInputElement>("[name='phone']", this.template);
    this.errorContainer = ensureElement<HTMLElement>('.form__errors', this.template);

    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.submitButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.email = this.emailInput.value;
      this.phone = this.phoneInput.value;
      this.events.emit('customerView:success', {
        email: this.email,
        phone: this.phone,
      });
    });

    this.emailInput.addEventListener('input', () => this.validation());
    this.phoneInput.addEventListener('input', () => this.validation());
  }

  public setButtonText(text: string): void {
    this.submitButton.textContent = text;
  }

  public setSubmitButtonState(isEnabled: boolean) {
    this.submitButton.disabled = !isEnabled;
}

  public validation(): void {
    const emailValue = this.emailInput.value;
    const phoneValue = this.phoneInput.value;
    this.submitButton.disabled = true;
    
    this.events.emit('validation:customerView', {
      email: {
          field: this.emailInput.name,
          value: emailValue
      },
      phone: {
          field: this.phoneInput.name,
          value: phoneValue
      }
    })
  }

  public showError(message: string) {
    this.errorContainer.textContent = message;
    this.errorContainer.style.display = 'block';
  }

  public clearErrors() {
    this.errorContainer.textContent = '';
    this.errorContainer.style.display = 'none';
  }

  public clear(): void {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.submitButton.disabled = true;
  }
}