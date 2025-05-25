import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductsItemList } from './components/model/ProductsItemList';
import { Order } from './components/model/Order';
import { Basket } from './components/model/Basket';
import { IProductItem } from './types';
import { ProductCardView } from './components/view/ProductCardView';
import { Modal } from './components/view/ModalView';
import { DetailedProductCardView } from './components/view/DetailedProductCardView';
import { OrderInPlacedView } from './components/view/OrderInPlacedView';

const order = new Order;
const basket = new Basket;

const api = new Api(API_URL);
const events = new EventEmitter();
const productsItemList = new ProductsItemList();
const gallery: HTMLElement = document.querySelector('.gallery');
const modal: Modal = new Modal();
const detailedProductsCardView: DetailedProductCardView[] = [];
const orderInPlacedView = new OrderInPlacedView(events);

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

	events.on('product:open', (data: IProductItem) => {
		modal.setContent(detailedProductsCardView.find((product) => product.title.textContent == data.title).template);
		modal.open();
	});	

	events.on('product:addBasket', () => {
		console.log('Продукт добавлен в корзину');
	});

	events.on('success:close', () => {
		console.log('Заказ оформлен успешно')
	});

	// orderInPlacedView.total.textContent = 'Списано ХХХ синапсов';
 	// modal.setContent(orderInPlacedView.template);
	// modal.open();