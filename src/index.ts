// Импорт глобальных стилей
import './scss/styles.scss';

// Импорт констант с URL API и CDN
import { API_URL, CDN_URL } from './utils/constants';

// Импорт базового API-класса
import { Api, ApiListResponse } from './components/base/api';

// Импорт класса для управления событиями
import { EventEmitter } from './components/base/events';

// Импорт моделей данных и бизнес-логики
import { ProductsItemList } from './components/model/ProductsItemList';
import { Order } from './components/model/Order';
import { Basket } from './components/model/Basket';

// Импорт представлений (view) для отображения элементов UI
import { BasketView } from './components/view/BasketView';
import { BasketItem } from './components/view/BasketItemView';
import { ProductCardView } from './components/view/ProductCardView';
import { Modal } from './components/view/ModalView';
import { DetailedProductCardView } from './components/view/DetailedProductCardView';
import { OrderInPlacedView } from './components/view/OrderInPlacedView';
import { CustomerView } from './components/view/CustomerView';
import { BillingView } from './components/view/BillingView';
import { ErrorView } from './components/view/ErrorView';

// Импорт типов данных для типизации
import { IOrder, TBasket, IProductItem, TCustomerInfo, TBillingInfo } from './types';

// Импорт утилиты для гарантированного получения DOM-элемента
import { ensureElement } from './utils/utils';

// Инициализация констант и объектов
const api = new Api(API_URL);
const events = new EventEmitter();
const productsItemList = new ProductsItemList();
const gallery: HTMLElement = document.querySelector('.gallery');
const modal: Modal = new Modal();
const detailedProductsCardView: DetailedProductCardView[] = [];
const basket = new Basket();
const basketView = new BasketView(events);
const order = new Order();
const orderInPlacedView = new OrderInPlacedView(events);
const customerView = new CustomerView(events);
const billingView = new BillingView(events)

// Получаем кнопку корзины в шапке сайта и навешиваем событие открытия корзины
ensureElement<HTMLElement>('.header__basket').addEventListener('click', () => events.emit('basket:open'));

// Получаем элемент счетчика количества товаров в корзине
const basketLabel = document.querySelector('.header__basket-counter');


// Запрашиваем список товаров с сервера
api.get('/product')
	.then((data: ApiListResponse<IProductItem>) => {
		data.items.forEach((elem) => {
			elem.image = `${CDN_URL}${elem.image}`;
			productsItemList.addProductItem(elem);
		});
		
        productsItemList.productItem.forEach((item) => {
			gallery.append(new ProductCardView(item, events).render());
			detailedProductsCardView.push(new DetailedProductCardView(item, events));
		});
	})
	.catch((err) => {
        console.error(`Ошибка при загрузке данных с сервера:`, err);
	});

// Логика презентора	
	// открытие карточки товара
	events.on('product:open', (data: IProductItem) => {
		modal.setContent(detailedProductsCardView.find((product) => product.title.textContent == data.title).template);
		modal.open();
	});	

	// добавление товара в корзину
	events.on('product:addBasket', (obj: DetailedProductCardView) => {
		const elem = {
			id: obj.id,
			title: obj.title.textContent,
			price: Number.parseFloat(obj.price.textContent.split(' ')[0]),
		};
		if (obj.getButtonText() === 'В корзину') {
			events.emit('basket:add', elem);
			obj.setButtonText('Удалить');
		} else {
			events.emit('basket:delete', elem);
			obj.setButtonText('В корзину');
		}
		modal.close();
	});

	// открытие корзины
	events.on('basket:open', () => {
		modal.setContent(basketView.render());
		modal.open();
	});

	// добавление товара в корзину
	events.on('basket:add', (data: TBasket) => {
		if (!basket.list.includes(data)) {
			basket.addProductItem(data);
			events.emit('basket:update');
		}
	});
	
	// удаление товара из корзины
	events.on('basket:delete', (data: TBasket) => {
		basket.deleteProductItem(data);
		const product = detailedProductsCardView.find((product) => product.id == data.id);
		if (product) {
			product.setButtonText('В корзину');
		}
		events.emit('basket:update');
	});
	
	// обновление состояния корзины
	events.on('basket:update', () => {
		basketLabel.textContent = basket.list.length.toString();
		let counter = 0;
		basketView.total = 0;
		basketView.ul.textContent = '';
		basketView.list = basket.list.map((item) => {
			counter++;
			basketView.total = item.price;
			const pr = new BasketItem(
				counter.toString(),
				item.title,
				item.price,
				item.id,
				events
			);
			basketView.setUl(pr.template);
			return pr;
		});
		basketView.render();
	});
	
	// оформление покупки товара
	events.on('basket:invoice', () => {
		modal.setContent(billingView.template);
	});

	// валидация формы с адресом почты и телефоном
	events.on('validation:customerView', ({ email, phone }: { 
		email: { field: string; value: string }; 
		phone: { field: string; value: string } }) => {
		const errorMessages: string[] = [];
		
		if (email) {
			const emailError = order.validateEmail(email.value);
			if (emailError) {
				errorMessages.push(emailError);
			}
		}
	
		if (phone) {
			const phoneError = order.validatePhone(phone.value);
			if (phoneError) {
				errorMessages.push(phoneError);
			}
		}
	
		if (errorMessages.length > 0) {
			customerView.showError(errorMessages.join(', '));
			customerView.setSubmitButtonState(false);
		} else {
			customerView.clearErrors(); 
			customerView.setSubmitButtonState(true);
		}
	});

	// сохранение данных заказа
	events.on('customerView:success', (data: TCustomerInfo) => {
		order.email = data.email;
		order.phone = data.phone;
		order.total = basket.sum;
		basket.list.forEach((item) => order.items.push(item.id));
		modal.setButtonText('Сохранение...');
		api
			.post('/order', order as IOrder)
			.then((res) => {
				if (Object.keys(res).includes('id')) {
					orderInPlacedView.total.textContent = `Списано ${order.total.toString()} синапсов`;
					events.emit('order:success');
				}
			})
			.catch((err) => {
				modal.setContent(
					new ErrorView(
						`Ошибка при сохранении: ${err})`
					).render()
				);
			});
	});

	// валидация формы с адресом
	events.on('validation:billingView', ({ payment, address }: { 
		payment: { field: string; value: string }; 
		address: { field: string; value: string } }) => {
		const errorMessages: string[] = [];

		if (payment) {
			const emailError = order.validationPayment(payment.value);
			if (emailError) {
				errorMessages.push(emailError);
			}
		}
	
		if (address) {
			const addressError = order.validationAddress(address.value);
			if (addressError) {
				errorMessages.push(addressError);
			}
		}
	
		if (errorMessages.length > 0) {
			billingView.showError(errorMessages.join(', '));
			billingView.setSubmitButtonState(false);
		} else {
			billingView.clearErrors(); 
			billingView.setSubmitButtonState(true);
		}
	});

	// сохранение формы со способом оплаты и адресом
	events.on('billingView:success', (data: TBillingInfo) => {
		order.payment = data.payment;
		order.address = data.address;
		modal.setContent(customerView.template);
		modal.open();
	});

	// успех сохранения заказа
	events.on('order:success', () => {
		modal.setContent(orderInPlacedView.template);
		order.items = [];
		basket.clearBasket();
		billingView.clear();
		customerView.clear();
		detailedProductsCardView.forEach((item) => item.setButtonText('В корзину'));
		events.emit('basket:update');
	});

	// заказ оформлен, за новыми покупками
	events.on('success:close', () => {
		modal.close();
	});