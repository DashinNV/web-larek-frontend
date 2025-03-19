import { IOrder } from "../../types";
import { cloneTemplate, ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export class Order implements IOrder {
  private buttonSubmit: HTMLButtonElement;
  buttonAll: HTMLButtonElement[];
  formErrors: HTMLElement;
  formOrder: HTMLFormElement;
  
  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formOrder = cloneTemplate<HTMLElement>(template) as HTMLFormElement;
    this.buttonAll = ensureAllElements<HTMLButtonElement>('.button_alt', this.formOrder) as HTMLButtonElement[];
    this.buttonSubmit = ensureElement('.order__button', this.formOrder) as HTMLButtonElement;
    this.formErrors = ensureElement('.form__errors', this.formOrder);
   
    this.buttonAll.forEach(item => {
      item.addEventListener('click', () => {
        this.paymentSelection = item.name;
        events.emit('order:paymentSelection', item);
      });
    });
  
    this.formOrder.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`order:changeAddress`, { field, value });
    });
  
    this.formOrder.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('contacts:open');
    });
  }

  render() {
      return this.formOrder
    }
  
// установить обводку вокруг выбранного метода оплаты
  set paymentSelection(paymentMethod: string) {
    this.buttonAll.forEach(item => {
      item.classList.toggle('button_alt-active', item.name === paymentMethod);
    })
  }
  
  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }
}