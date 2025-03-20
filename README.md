# Проектная работа "Веб-ларёк"
https://github.com/DashinNV/web-larek-frontend.git

Интернет-магазин с товарами для веб-разработчиков - Web-ларёк. В нём можно посмотреть каталог товаров, добавить товары в корзину и сделать заказ.

## Содержание

1. [Используемый стек технологий](#используемый-стек-технологий)
2. [Инструкция по установке и запуску](#инструкция-по-установке-и-запуску)
3. [Описание архитектуры проекта](#описание-архитектуры-проекта)
4. [Описание данных](#описание-данных)
5. [Модели данных](#модели-данных)
6. [Компоненты представления](#компоненты-представления)
7. [Описание событий](#описание-событий)


## Используемый стек технологий
HTML, SCSS, TS, Webpack
    

## Инструкция по установке и запуску
### Структура проекта
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

### Важные файлы
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

### Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
### Сборка

```
npm run build
```

или

```
yarn build
```
    
## Описание архитектуры проекта
В проекте реализован принцип MVP (Model-View-Presenter)- это архитектурный паттерн, который помогает организовать код и разделить ответственность между различными компонентами приложения. Он делит приложение на три основных компонента:

Model (Модель): Модель отвечает за управление данными приложения. Она взаимодействует с базой данных, API и выполняет бизнес-логику. Модель не знает ничего о пользовательском интерфейсе и не взаимодействует с ним напрямую.

View (Представление): Представление отвечает за отображение данных пользователю и взаимодействие с ним. Оно отображает интерфейс и получает ввод от пользователя (например, нажатия кнопок, ввод текста). View не содержит бизнес-логики и не управляет состоянием данных.

EventEmitter выступает в роли Presenter (Представитель): Представитель связывает Модель и Представление. Он получает события от View, обрабатывает их, взаимодействует с Model для получения или изменения данных, а затем обновляет View с использованием полученной информации. Presenter содержит всю бизнес-логику и отвечает за управление состоянием приложения.

## Описание данных

/// интерфейс товара
```typescript
interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    selected: boolean;
  }
```

/// интерфейс представления карточки товара
```typescript
interface ICard {
  text: HTMLElement;
  button: HTMLElement;
  render(data: IProductItem): HTMLElement;
}
```

/// интерфейс модели данных "Форма"
```typescript
interface IFormModel {
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
```

/// интерфейс представления заказа
```typescript
interface IOrder {
  formOrder: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  paymentSelection: String;
  formErrors: HTMLElement;
  render(): HTMLElement;
}
```

/// интерфейс представления формы контакты
```typescript
interface IContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
}
```

/// интерфейс модели данных "Корзина"
```typescript
interface IBasketModel {
  basketProducts: IProductItem[];
  addProductToBasket(data: IProductItem): void;
  deleteProductFromBasket(item: IProductItem): void;
  clearBasketProducts(): void;
  getCounterProducts: () => number;
  getSumAllProducts: () => number;
}
```

/// интерфейс представления "Корзины"
```typescript
interface IBasket {
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
```

/// интерфейс представления товара в "Корзине"
```typescript
interface IBasketItem {
    basketItem: HTMLElement;
    index:HTMLElement;
    title: HTMLElement;
    price: HTMLElement;
    buttonDelete: HTMLButtonElement;
    render(data: IProductItem, item: number): HTMLElement;
}
```

/// интерфейс представления успешного оформления заказа
```typescript
interface ISuccess {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;
  render(total: number): HTMLElement;
}
```

// интерфейс представления модального окна
```typescript
interface IModal {
  open(): void;
  close(): void;
  render(): HTMLElement
}
```

/// интерфейс модели данных состояния приложения
```typescript
interface IDataModel {
  productCards: IProductItem[];
  selectedCard: IProductItem;
  setPreview(item: IProductItem): void;
}
```

/// интерфейс данных сделанного заказа
```typescript
interface IOrderLot{
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
```

/// интерфейс результата заказа
```typescript
interface IOrderResult {
  id: string;
  total: number;
}
```
/// интерфейс модели данных API
```typescript
interface IApiModel {
  cdn: string;
  items: IProductItem[];
  getListProductCard: () => Promise<IProductItem[]>;
  postOrderLot: (order: IOrderLot) => Promise<IOrderResult>;
}
```
/// тип ошибок формы заказа
```typescript
type FormErrors = Partial<Record<keyof IOrderForm, string>>;
```


/// интерфейс события клика мыши
```typescript
interface IActions {
  onClick: (event: MouseEvent) => void;
}
```

/// интерфейс формы заказа
```typescript
interface IOrderForm {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
  total?: string | number;
}
```



## Модели данных
### Класс `Api` родительский класс для класса `ApiModel`, обеспечивает базовые методы для взаимодействия с API

Методы:
- `handleResponse` - метод обрабатывает ответ от сервера.
- `get` -  метод используется для выполнения HTTP-запроса типа GET, чтобы получить данные с сервера.
- `post` - метод используется для выполнения HTTP-запроса типа POST (или других методов, таких как PUT и DELETE), чтобы отправить данные на сервер.

### Класс `ApiModel` наследуется от класса `Api`, передаёт и получает данные от сервера.

Методы:
- `getListProductCard` - получаем массив объектов(карточек) с сервера.
- `postOrderLot` - получаем ответ от сервера по сделанному/отправленному заказу.

### Класс `BasketModel` хранит и работает с данными полученными от пользователя.

Методы:
- `addProductToBasket` - добавляет товар в корзину.
- `deleProductFromBasket` - удаляет товар из корзины.
- `clearBasketProducts` - очищает/удаляет все товары из корзины.
- `getCounterProducts` - возвращает количество товаров в корзине.
- `getSumAllProducts` - считает и возвращает стоимость всех товаров в корзине.

### Класс `DataModel` принимает и хранит данные товаров, полученных с сервера.

Метод:
- `setPreview` - получает данные карточки товара, которую открыл пользователь.

### Класс `FormModel` хранит данные полученные от пользователя.

Методы:
- `setOrderAddress` - принимаем/сохраняет адрес пользователя.
- `validateOrder` - проверяет адрес пользователя / и способ оплаты.
- `setOrderData` - принимаем/сохраняет номер телефона/почту пользователя.
- `validateContacts` - проверяет номер телефона/почту пользователя.
- `getOrderLot` - возвращает объект данных пользователя с выбранными товарами.

## Компоненты представления
### Класс `Basket` управляет отображением корзины.

Методы:
- `renderHeaderBasketCounter` - сохраняет и устанавливает какое количество товаров находится в корзине.
- `renderSumAllProducts` - сохраняет и устанавливает стоимость всех товаров в корзине.

### Класс `BasketItem` управляет отображением товаров в корзине.

метод:
- `formatPrice` - принимает цену товара в числовом значении и возвращает в строчном.
- `render` - отображает актуальные  данные о товаре в корзине.

### Класс `Card` является родительским классом для класса `CardPreview`, управляет отображением карточки товара на веб странице.

Методы:
- `setText` - принимает два значения, первое HTMLElement, второе значение задаёт текстовое содержимое HTMLElement.
- `cardCategory` - принимает строчное значение и создаёт новый className для HTMLElement.
- `setPrice` - принимает цену продукта в числовом значении и возвращает в строчном.

### Класс `CardPreview` наследуется от класса `Card` и управляет отображением подробного описания карточки товара в превью, позволяет добавить карточку в корзину.

Метод:
- `updateButtonState` - принимает данные о товаре, проверяет наличие цены товара, при отсутствии цены ограничивает покупку, проверяет наличие товара в корзине и при наличии ограничивает повторную покупку.

### Класс `Order` управляет отображением содержимого модального окна и позволяет принять от пользователя метод оплаты и адрес.

Метод:
- `paymentSelection` - устанавливает обводку вокруг выбранного метода оплаты.

### Класс `Contacts` управляет отображением содержимого модального окна и позволяет принять от пользователя номер телефона и Email.
 
### Класс `Modal` управляет отображением модальных окон.

Методы:
- open - отображает модальное окон.
- close - закрывает модальное окно.

### Класс `Success` управляет отображением удачного заказа в модальном окне.


## Описание событий
### Класс `EventEmitter` - брокер событий, реализует интерфейс IEvents и имеет следующие методы.

Класс EventEmitter реализует паттерн «Observer/Наблюдатель» и обеспечивает работу событий, его методы позволяют устанавливать и снимать слушатели событий, вызвать слушатели при возникновении события.

Методы:
- `on` - для подписки на событие.
- `off` - для отписки от события.
- `emit` - уведомления подписчиков о наступлении события соответственно.
- `onAll` - для подписки на все события.
- `offAll` - сброса всех подписчиков.
- `trigger` - генерирует заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса `EventEmitter`.

### Обработчик события получение карточек товаров productCards:receive
### Обработчик события выбор карточки товара card:select
### Обработчик события открытия модального окна карточки товара modalCard:open
### Обработчик события добавление карточки товара в "Корзину" card:addBasket
### Обработчик события открытия модального окна "Корзины" basket:open
### Обработчик события удаление карточки товара из "Корзины" basket:basketItemRemove
### Обработчик события открытие модального окна "Способ оплаты" "Адрес доставки" order:open
### Обработчик события изменения в поле ввода "Адрес доставки" order:changeAddress
### Обработчик события валидации строки arrdess и payment formError:address
### Обработчик события открытия модального окна "Email" и "Телефон" contacts:open
### Обработчик события изменения в полях  "Email" и "Телефон" contacts:changeInput
### Обработчик события валидация строки "Email"и "Телефон"formError:change
### Обработчик события успешного оформления заказа success:open
### Обработчик события закрытия модального окна success:close

