import { cloneTemplate, ensureElement  } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { BasketItem } from './BasketItemView';

export class BasketView {
    template: HTMLElement;
    ul: HTMLElement;
    totalPrice: HTMLElement;
    basketSubmitButton: HTMLButtonElement;
    private _total: number = 0;
    private _list: BasketItem[] = [];
    events: EventEmitter;

    constructor(broker: EventEmitter) {
        this.events = broker;
        this.template = cloneTemplate('#basket');
        this.ul = ensureElement<HTMLElement>('.basket__list', this.template);
        this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.template);
        this.basketSubmitButton = ensureElement<HTMLButtonElement>('.button', this.template);
        
        this.basketSubmitButton.disabled = true;
        this.basketSubmitButton.addEventListener('click', () =>
            this.events.emit('basket:invoice')
        );

        this.ul.textContent = 'Корзина пуста.';
    }

    set list(content: BasketItem[]) {
		this._list = content;
		if (this._list.length === 0) {
			this.basketSubmitButton.disabled = true;
			this.ul.textContent = 'Корзина пуста.';
		} else this.basketSubmitButton.disabled = false;
		this.totalPrice.textContent = `${this._total} синапсов`;
	}

    set total(count: number) {
        this._total = count === 0 ? count : this._total + count;
    }

    get total() { return this._total }

    setUl(elem: HTMLElement) { this.ul.append(elem) }

    render() { return this.template }
}