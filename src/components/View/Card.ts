import { IProductItem, IActions,} from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface ICard {
    render(data: IProductItem): HTMLElement;
  }

export class Card implements ICard {
  protected _cardCategory: HTMLElement;
  protected _cardElement: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _colors = <Record<string, string>>{
    "дополнительное": "additional",
    "софт-скил": "soft",
    "кнопка": "button",
    "хард-скил": "hard",
    "другое": "other",
  }
    
  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this._cardElement = cloneTemplate<HTMLElement>(template) as HTMLElement;
    this._cardCategory = ensureElement<HTMLElement>('.card__category', this._cardElement);
    this._cardTitle = ensureElement<HTMLElement>('.card__title', this._cardElement);
    this._cardImage = ensureElement<HTMLImageElement>('.card__image', this._cardElement);
    this._cardPrice = ensureElement<HTMLElement>('.card__price', this._cardElement);
    
    if (actions?.onClick) {
      this._cardElement.addEventListener('click', actions.onClick);
    }
  }
  
  protected setPrice(value: number | null): string {
    if (value === null) {
      return 'Бесценно'
    }
    return String(value) + ' синапсов'
  }
  
  protected setText(element: HTMLElement, value: unknown): string {
    if (element) {
      return element.textContent = String(value);
    }
    return ''; // Возвращаем пустую строку, если элемент не передан
  }
  
  render(data: IProductItem): HTMLElement {
    this._cardCategory.textContent = data.category;
    this.cardCategory = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = this.setPrice(data.price);
    return this._cardElement;
  }
  
  set cardCategory(value: string) {
    this.setText(this._cardCategory, value);
    this._cardCategory.className = `card__category card__category_${this._colors[value]}`
  }
}