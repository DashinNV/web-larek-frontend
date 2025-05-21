import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { Api, ApiListResponse, ApiPostMethods } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductsItemList } from './components/model/ProductsItemList';
import { Order } from './components/model/Order';
import { Basket } from './components/model/Basket';

const productsItemList = new ProductsItemList;
const order = new Order;
const basket = new Basket;
