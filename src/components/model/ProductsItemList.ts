import { IProductItem } from "../../types";

export class ProductsItemList {
    _productItem: IProductItem[] = [];
    
    addProductItem(item: IProductItem) {
        this._productItem.push(item);
    }

    get productItem(): IProductItem[] {
        return this._productItem;
    }
}