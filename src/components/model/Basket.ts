import { TBasket } from "../../types";

export class Basket {
    list: TBasket[] = [];
    sum: number = 0;

    addProductItem(item: TBasket) {
        this.list.push(item);
        this.sum += item.price;
    };
    
    deleteProductItem(item: TBasket) {
        this.list = this.list.filter(existingItem => existingItem.id !== item.id);
        this.sum -= item.price;
    };

    clearBasket() {
        this.list = [];
        this.sum = 0;
    };
}