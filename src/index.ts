import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductsItemList } from './components/model/ProductsItemList';
import { Order } from './components/model/Order';
import { Basket } from './components/model/Basket';
import { IProductItem } from './types';
import { ProductCardView } from './components/view/ProductCardView';

const order = new Order;
const basket = new Basket;

const api = new Api(API_URL);
const events = new EventEmitter();
const productsItemList = new ProductsItemList();
const gallery: HTMLElement = document.querySelector('.gallery');


api.get('/product')
	.then((data: ApiListResponse<IProductItem>) => {
		data.items.forEach((elem) => {
			elem.image = `${CDN_URL}${elem.image}`;
			productsItemList.addProductItem(elem);
		});
		
        productsItemList.productItem.forEach((item) => {
			gallery.append(new ProductCardView(item, events).render());
		});
	})
	.catch((err) => {
        console.error(`Ошибка при загрузке данных с сервера:`, err);
	});