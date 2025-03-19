import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiModel';
import { DataModel } from './components/Model/DataModel';
import { Card } from './components/View/Card';
import { CardPreview } from './components/View/CardPreview';
import { IOrderForm, IProductItem } from './types';
import { Modal } from './components/View/Modal';
import { ensureElement } from './utils/utils';
import { BasketModel } from './components/Model/BasketModel';
import { Basket } from './components/View/Basket';
import { BasketItem } from './components/View/BasketItem';
import { FormModel } from './components/Model/FormModel';
import { Order } from './components/View/FormOrder';
import { Contacts } from './components/View/FormContacts';
import { Success } from './components/View/Success';

// инициализировать
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketModel = new BasketModel();
const basket = new Basket(basketTemplate, events);
const formModel = new FormModel(events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);

// отобразить карточки товаров
events.on('productCards:receive', () => {
  dataModel.productCards.forEach(item => {
    const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
  });
});

// получить объект данных "IProductItem" карточки по которой кликнули
events.on('card:select', (item: IProductItem) => { dataModel.setPreview(item) });

// открыть модальное окно карточки товара
events.on('modalCard:open', (item: IProductItem) => {
  const cardPreview = new CardPreview(cardPreviewTemplate, events)
  modal.content = cardPreview.render(item);
  modal.render();
});

// добавить карточку товара в корзину
events.on('card:addBasket', () => {
  basketModel.addProductToBasket(dataModel.selectedCard);
  basket.renderHeaderBasketCounter(basketModel.getCounterProducts()); // отобразить количество товара на иконке корзины
  modal.close();
});

// открыть модальное окно корзины
events.on('basket:open', () => {
  basket.renderSumAllProducts(basketModel.getSumAllProducts());// отобразить сумму всех продуктов в корзине
  basket.items = basketModel.basketProducts.map((item, index) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    return basketItem.render(item, index + 1); // Используем index для нумерации
  });
  modal.content = basket.render();
  modal.render();
});

// удалить карточку товара из корзины
events.on('basket:basketItemRemove', (item: IProductItem) => {
  basketModel.deleteProductFromBasket(item);
  basket.renderHeaderBasketCounter(basketModel.getCounterProducts()); // отобразить количество товара на иконке корзины
  basket.renderSumAllProducts(basketModel.getSumAllProducts()); // отобразить сумму всех продуктов в корзине
  basket.items = basketModel.basketProducts.map((item, index) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    return basketItem.render(item, index + 1); // Используем index для нумерации
  });
});

// открыть модальное окна "способа оплаты" и "адрес доставки"
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
  formModel.items = basketModel.basketProducts.map(item => item.id); // передать список id товаров которые покупаем
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => { formModel.payment = button.name }) // передать способ оплаты

// отследить изменение в поле в вода "адреса доставки"
events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.field, data.value);
});

// валидировать данные строки "address" и payment
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

// открыть модальное окна "Email" и "Телефон"
events.on('contacts:open', () => {
  formModel.total = basketModel.getSumAllProducts();
  modal.content = contacts.render();
  modal.render();
});

// отследить изменение в полях вода "Email" и "Телефон"
events.on(`contacts:changeInput`, (data: { field: string, value: string }) => {
  formModel.setOrderData(data.field, data.value);
});

// валидировать данные строки "Email" и "Телефон"
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

// открыть модальное окно "Заказ оформлен"
events.on('success:open', () => {
  apiModel.postOrderLot(formModel.getOrderLot())
    .then((data) => {
      console.log(data); // ответ сервера
      const success = new Success(successTemplate, events);
      modal.content = success.render(basketModel.getSumAllProducts());
      basketModel.clearBasketProducts(); // очищаем корзину
      basket.renderHeaderBasketCounter(basketModel.getCounterProducts()); // отобразить количество товара на иконке корзины
      modal.render();
    })
    .catch(error => console.log(error));
});

events.on('success:close', () => modal.close());

// блокировать прокрутку страницы при открытие модального окна
events.on('modal:open', () => {
  modal.locked = true;
});

// разблокировать прокрутку страницы при закрытие модального окна
events.on('modal:close', () => {
  modal.locked = false;
});

// получить данные с сервера
apiModel.getListProductCard()
  .then(function (data: IProductItem[]) {
    dataModel.productCards = data;
  })
  // .then(dataModel.setProductCards.bind(dataModel))
  .catch(error => console.log(error))