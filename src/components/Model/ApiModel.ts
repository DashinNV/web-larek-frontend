import { IProductItem, IOrderLot, IOrderResult } from "../../types";
import { Api, ApiListResponse } from "../base/api";

export class ApiModel extends Api {
  private cdn: string;
  private items: IProductItem[];
  
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

// получить массив карточек с сервера
  getListProductCard(): Promise<IProductItem[]> {
    return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }
  
// получить ответ от сервера по сделанному заказу
  postOrderLot(order: IOrderLot): Promise<IOrderResult> {
    return this.post(`/order`, order).then((data: IOrderResult) => data);
  }
}