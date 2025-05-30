import { IProductItem } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

export class DetailedProductCardView {
    public template: HTMLElement;
    private image: HTMLImageElement;
    private category: HTMLElement;
    public title: HTMLElement;
    private description: HTMLElement;
    public price: HTMLElement;
    private submitButton: HTMLButtonElement;
    public id: string;
    private events: EventEmitter;

    constructor(prod: IProductItem, broker: EventEmitter) {
        this.events = broker;
        this.template = cloneTemplate('#card-preview');

        this.image = ensureElement<HTMLImageElement>('.card__image', this.template);
        this.category = ensureElement<HTMLElement>('.card__category', this.template);
        this.title = ensureElement<HTMLElement>('.card__title', this.template);
        this.description = ensureElement<HTMLElement>('.card__text', this.template);
        this.price = ensureElement<HTMLElement>('.card__price', this.template);
        this.submitButton = ensureElement<HTMLButtonElement>('.button', this.template);

        this.id = prod.id;
        this.image.src = prod.image;
        this.category.textContent = prod.category;

        this.setCategoryClass(prod.category);

        this.title.textContent = prod.title;
        this.description.textContent = prod.description;

        this.setPriceAndButtonState(prod.price);

        this.submitButton.addEventListener('click', this.handleCloseClick.bind(this));
    }

    private setCategoryClass(category: string) {
        const categoryClassMap: { [key: string]: string } = {
            'другое': 'card__category_other',
            'софт-скил': 'card__category_soft',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
        };
        
        const categoryClass = categoryClassMap[category] || 'card__category_hard';
        this.category.classList.add(categoryClass);
    }

    private setPriceAndButtonState(price: number | null) {
        if (price === null) {
            this.price.textContent = `Бесценно`;
            this.submitButton.disabled = true;
        } else {
            this.price.textContent = `${price} синапсов`;
        }
    }

    private handleCloseClick(evt: MouseEvent) {
        evt.preventDefault();
        this.events.emit('product:addBasket', this);
    }

    public getButtonText() {
        return this.submitButton.textContent;
    }

    public setButtonText(text: string) {
        this.submitButton.textContent = text;
    }
}