import { IContacts } from "../../types";
import { cloneTemplate, ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export class Contacts implements IContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  
  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formContacts = cloneTemplate<HTMLElement>(template) as HTMLFormElement;
    this.inputAll = ensureAllElements<HTMLInputElement>('.form__input', this.formContacts);
    this.buttonSubmit = ensureElement<HTMLButtonElement>('.button', this.formContacts);
    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.formContacts);
    
    this.inputAll.forEach(item => {
      item.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const field = target.name;
        const value = target.value;
        this.events.emit(`contacts:changeInput`, { field, value });
      })
    })
  
    this.formContacts.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('success:open');
    });
  }
  
  render() {
    return this.formContacts
  }
  
  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }
}