import { IProductItem, IBasketModel } from "../../types";

export class BasketModel implements IBasketModel {
  protected _basketProducts: IProductItem[];

  constructor() {
    this._basketProducts = [];
  }
  
  set basketProducts(data: IProductItem[]) {
    this._basketProducts = data;
  }
  
  get basketProducts() {
    return this._basketProducts;
  }

// добавить товар в корзину
addProductToBasket(data: IProductItem): void {
  data.selected = true;
  this._basketProducts.push(data);
}

deleteProductFromBasket(item: IProductItem): void {
  item.selected = false;
  this._basketProducts = this._basketProducts.filter(product => product !== item);
}

// очистить корзину
clearBasketProducts(): void {
  this.basketProducts = [];
}  

// посчитать количество товара в корзине
  getCounterProducts(): number {
    return this.basketProducts.length;
  }
  
// суммировать стоимость товара в корзине
  getSumAllProducts(): number {
    return this.basketProducts.reduce((sum, item) => {
      return sum + (item.price || 0); // Используем || 0 для предотвращения NaN
    }, 0);
  }
}