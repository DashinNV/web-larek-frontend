import { IBasketItem, IProductItem } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface IActions {
    onClick: (event: MouseEvent) => void;
  }

export class BasketItem implements IBasketItem {
  basketItem: HTMLElement;
  buttonDelete: HTMLButtonElement;
  index:HTMLElement;
  price: HTMLElement;
  title: HTMLElement;
  
  constructor (template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this.basketItem = cloneTemplate<HTMLElement>(template) as HTMLElement;
    this.index = ensureElement<HTMLElement>('.basket__item-index', this.basketItem);
    this.title = ensureElement<HTMLElement>('.card__title', this.basketItem);
    this.price = ensureElement<HTMLElement>('.card__price', this.basketItem);
    this.buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.basketItem);
    
      if (actions?.onClick) {
        this.buttonDelete.addEventListener('click', actions.onClick);
      }
 }

  protected formatPrice(value: number | null): string {
    if (value === null) {
      return 'Бесценно';
    }
    return String(value) + ' синапсов';
  }
  
  render(data: IProductItem, item: number) {
    this.index.textContent = String(item);
    this.title.textContent = data.title;
    this.price.textContent = this.formatPrice(data.price);
    return this.basketItem;
  }
}