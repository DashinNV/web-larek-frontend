import { IProductItem } from '../../types';
import { cloneTemplate, ensureElement, setElementData } from '../../utils/utils';
import { EventEmitter } from '../base/events';

export class ProductCardView {
    private template: HTMLElement;
    private title: HTMLElement;
    private price: HTMLElement;
    private category: HTMLElement;
    private image: HTMLImageElement;
    private product: IProductItem;
    private events: EventEmitter;

    constructor(prod: IProductItem, broker: EventEmitter) {
        this.product = prod;
        this.events = broker;
        this.template = cloneTemplate('#card-catalog');

        // Инициализация элементов разметки
        this.title = ensureElement('.card__title', this.template);
        this.price = ensureElement('.card__price', this.template);
        this.category = ensureElement('.card__category', this.template);
        this.image = ensureElement<HTMLImageElement>('.card__image', this.template);

        this.updateView();
        this.addEventListeners();
    }

    private updateView() {
        this.title.textContent = this.product.title;
        this.price.textContent = this.product.price ? `${this.product.price} синапсов` : 'Бесценно';
        this.category.textContent = this.product.category;
        this.setCategoryClass(this.product.category);
        this.image.src = this.product.image;

        setElementData(this.template, {
            productId: this.product.id,
            productCategory: this.product.category,
        });
    }

    private setCategoryClass(category: string) {
        const categoryClasses: { [key: string]: string } = {
            'другое': 'card__category_other',
            'софт-скил': 'card__category_soft',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
            'default': 'card__category_hard'
        };

        const categoryClass = categoryClasses[category] || categoryClasses['default'];
        this.category.classList.add(categoryClass);
    }

    private addEventListeners() {
        this.template.addEventListener('click', () => {
            this.events.emit('product:open', this.product);
        });
    }

    public render(): HTMLElement {
        return this.template;
    }
}