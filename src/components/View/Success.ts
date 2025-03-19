import { cloneTemplate, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export class Success {
  private button: HTMLButtonElement;
  private description: HTMLElement;
  private success: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.success = cloneTemplate<HTMLElement>(template) as HTMLElement;
    this.description = ensureElement<HTMLElement>('.order-success__description', this.success);
    this.button = ensureElement<HTMLButtonElement>('.order-success__close', this.success);

    this.button.addEventListener('click', () => { events.emit('success:close') });
  }
  
  render(total: number) {
    this.description.textContent = String(`Списано ${total} синапсов`);
    return this.success
  }
}