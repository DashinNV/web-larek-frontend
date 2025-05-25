import { cloneTemplate, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

export class OrderInPlacedView {
  public template: HTMLElement;
  private submitButton: HTMLButtonElement;
  public total: HTMLElement;
  private events: EventEmitter;

  constructor(broker: EventEmitter) {
    this.events = broker;
    this.template = cloneTemplate<HTMLElement>('#success');
    this.submitButton = ensureElement<HTMLButtonElement>('.order-success__close', this.template);
    this.total = ensureElement<HTMLElement>('.order-success__description', this.template);

    this.submitButton.addEventListener('click', this.handleCloseClick.bind(this));

  }

  private handleCloseClick(evt: MouseEvent) {
    evt.preventDefault();
    this.events.emit('success:close');
  }
}
