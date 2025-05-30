import { cloneTemplate, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

export class BasketItem {
    template: HTMLElement; 
    index: HTMLElement;
    title: HTMLElement;
    price: number;
    priceElement: HTMLElement;
    buttonDelete: HTMLButtonElement;
    id: string;
    events: EventEmitter;
    
    constructor(index: string, title: string, price: number, id: string, broker: EventEmitter) {
        this.id = id;
        this.price = price;

        this.template = cloneTemplate('#card-basket');
        this.index = ensureElement<HTMLElement>('.basket__item-index', this.template);
        this.title = ensureElement<HTMLElement>('.card__title', this.template);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.template);
        this.buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.template);

        this.title.textContent = title;
        this.priceElement.textContent = `${price.toString()} синапсов`;
        this.index.textContent = index;

        this.events = broker;

        this.buttonDelete.addEventListener('click', () => {
            this.events.emit('basket:delete', {
                id: this.id,
                title: this.title.textContent,
                price: this.price,
            });
        });
    }
}