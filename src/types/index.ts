export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export type TProductItemsMainPage = Pick<IProductItem, 'category' | 'title' | 'image' | 'price'>

export type TProductItems = Pick<IProductItem, 'category' | 'title' | 'description' | 'image' | 'price'>

export type TBasket = Pick<IProductItem, 'id' | 'title' | 'price'>;

export type TBillingInfo = Pick<IOrder, 'payment' | 'address'>

export type TCustomerInfo = Pick<IOrder, 'email' | 'phone'>