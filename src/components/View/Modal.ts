import { IModal } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";


export class Modal implements IModal {
  protected _content: HTMLElement;
  protected _pageWrapper: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected modalContainer: HTMLElement;
  constructor(modalContainer: HTMLElement, protected events: IEvents) {
    this.modalContainer = modalContainer;
    this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.modalContainer);
    this._content = ensureElement<HTMLElement>('.modal__content', this.modalContainer);

    this.closeButton.addEventListener('click', this.close.bind(this));
    this.modalContainer.addEventListener('click', this.close.bind(this));
    this.modalContainer.querySelector('.modal__container').addEventListener('click', event => event.stopPropagation());
  }
  
// принять элемент разметки который будет отображаться в "modal__content" модального окна
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }
  
// открыть модальное окно
  open() {
    this.modalContainer.classList.add('modal_active');
    this.events.emit('modal:open');
  }
  
// закрыть модальное окно
  close() {
    this.modalContainer.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:close');
 }
  
  set locked(value: boolean) {
    if (value) {
      this._pageWrapper.classList.add('page__wrapper_locked');
    } else {
      this._pageWrapper.classList.remove('page__wrapper_locked');
    }
  }
  
  render(): HTMLElement {
    this._content;
    this.open();
    return this.modalContainer
  }
}