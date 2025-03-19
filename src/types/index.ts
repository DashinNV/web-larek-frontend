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

  export interface IActions {
    onClick: (event: MouseEvent) => void;
  }

  export interface ICard {
    text: HTMLElement;
    button: HTMLElement;
    render(data: IProductItem): HTMLElement;
  }

  export interface IOrder {
    formOrder: HTMLFormElement;
    buttonAll: HTMLButtonElement[];
    paymentSelection: String;
    formErrors: HTMLElement;
    render(): HTMLElement;
  }

  export interface IContacts {
    formContacts: HTMLFormElement;
    inputAll: HTMLInputElement[];
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;
    render(): HTMLElement;
  }

  export interface IBasketItem {
    basketItem: HTMLElement;
      index:HTMLElement;
      title: HTMLElement;
      price: HTMLElement;
      buttonDelete: HTMLButtonElement;
      render(data: IProductItem, item: number): HTMLElement;
  }

  export interface IBasket {
    basket: HTMLElement;
    title: HTMLElement;
    basketList: HTMLElement;
    button: HTMLButtonElement;
    basketPrice: HTMLElement;
    headerBasketButton: HTMLButtonElement;
    headerBasketCounter: HTMLElement;
    renderHeaderBasketCounter(value: number): void;
    renderSumAllProducts(sumAll: number): void;
    render(): HTMLElement;
  }

  export interface IModal {
    open(): void;
    close(): void;
    render(): HTMLElement
  }