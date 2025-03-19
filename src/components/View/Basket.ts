import { IBasket } from "../../types";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export class Basket implements IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.basket = cloneTemplate<HTMLElement>(template) as HTMLElement;
    this.title = ensureElement<HTMLElement>('.modal__title', this.basket);
    this.basketList = ensureElement<HTMLElement>('.basket__list', this.basket);
    this.button = ensureElement<HTMLButtonElement>('.basket__button', this.basket);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.basket);
    this.headerBasketButton = ensureElement<HTMLButtonElement>('.header__basket');
    this.headerBasketCounter = ensureElement<HTMLElement>('.header__basket-counter');

    this.button.addEventListener('click', () => { this.events.emit('order:open') });
    this.headerBasketButton.addEventListener('click', () => { this.events.emit('basket:open') });

    //this.items = [];
  }
  
  renderHeaderBasketCounter(value: number) {
    this.headerBasketCounter.textContent = String(value);
  }
  
  renderSumAllProducts(sumAll: number) {
    this.basketPrice.textContent = String(sumAll + ' синапсов');
  }
  
  render() {
    //this.title.textContent = 'Корзина';
    return this.basket;
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);
      this.button.removeAttribute('disabled');
    } else {
      this.button.setAttribute('disabled', 'disabled');
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }
}