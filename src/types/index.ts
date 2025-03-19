export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }

  export interface IOrderLot{
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
  }
  
  export interface IOrderResult {
    id: string;
    total: number;
  }

  export interface IDataModel {
    productCards: IProductItem[];
    selectedCard: IProductItem;
    setPreview(item: IProductItem): void;
  }

  export interface IFormModel {
    items: string[];
    payment: string;
    total: number;
    email: string;
    phone: string;
    address: string;
    setOrderAddress(field: string, value: string): void
    validateOrder(): boolean;
    setOrderData(field: string, value: string): void
    validateContacts(): boolean;
    getOrderLot(): object;
  }

  export interface IOrderForm {
    payment?: string;
    address?: string;
    phone?: string;
    email?: string;
    total?: string | number;
  }

  export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

  export interface IBasketModel {
    basketProducts: IProductItem[];
    addProductToBasket(data: IProductItem): void;
    deleteProductFromBasket(item: IProductItem): void;
    clearBasketProducts(): void;
    getCounterProducts: () => number;
    getSumAllProducts: () => number;
  }