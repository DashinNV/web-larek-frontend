import { IActions, ICard, IProductItem } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Card } from "./Card";

export class CardPreview extends Card implements ICard {
  button: HTMLElement;
  text: HTMLElement;
  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    super(template, events, actions);
    this.text = ensureElement<HTMLElement>('.card__text', this._cardElement);
    this.button = ensureElement<HTMLElement>('.card__button', this._cardElement);
    this.button.addEventListener('click', () => {
      if (this.button.textContent === 'Убрать') {
        
      } else {
        this.events.emit('card:addBasket');
      }
    });
  }
  
  private updateButtonState(data: IProductItem) {
    if (data.price) {
      this.button.removeAttribute('disabled');
      if (data.selected) {
        return 'Убрать';
      } else {
        return 'Купить';
      }
    } else {
      this.button.setAttribute('disabled', 'true');
      return 'Не продается';
    }
  }

  render(data: IProductItem): HTMLElement {
    this._cardCategory.textContent = data.category;
    this.cardCategory = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = this.setPrice(data.price);
    this.text.textContent = data.description;
    this.button.textContent = this.updateButtonState(data);
    return this._cardElement;
  }
}