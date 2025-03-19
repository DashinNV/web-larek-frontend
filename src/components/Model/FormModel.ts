import { IFormModel, FormErrors } from "../../types";
import { IEvents } from "../base/events";

enum FormFields {
  ADDRESS = 'address',
  EMAIL = 'email',
  PHONE = 'phone',
}

export class FormModel implements IFormModel {
  private formErrors: FormErrors = {};
  items: string[] = [];
  payment: string = '';
  total: number = 0;
  email: string = '';
  phone: string = '';
  address: string = '';

// Установить регулярные выражения для валидации
  private regexpAddress = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
  private regexpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;

  constructor(protected events: IEvents) {}

// Установить адрес и проверить валидность
  setOrderAddress(field: string, value: string) {
    if (field === FormFields.ADDRESS) {
      this.address = value;
    }
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.getOrderLot());
    }
  }

// Валидировать данные строки "address"
  validateOrder(): boolean {
    const errors: FormErrors = {};

    if (!this.address) {
      errors.address = 'Необходимо указать адрес';
    } else if (!this.regexpAddress.test(this.address)) {
      errors.address = 'Укажите настоящий адрес';
    }

    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:address', this.formErrors);
    return Object.keys(errors).length === 0;
  }

// Установить данные email и номера телефона
  setOrderData(field: string, value: string) {
    if (field === FormFields.EMAIL) {
      this.email = value;
    } else if (field === FormFields.PHONE) {
      this.phone = value;
    }

    if (this.validateContacts()) {
      this.events.emit('order:ready', this.getOrderLot());
    }
  }

// Валидировать данные email и номера телефона
  validateContacts(): boolean {
    const errors: FormErrors = {};

    if (!this.email) {
      errors.email = 'Необходимо указать email';
    } else if (!this.regexpEmail.test(this.email)) {
      errors.email = 'Некорректный адрес электронной почты';
    }

    if (!this.phone) {
      errors.phone = 'Необходимо указать телефон';
    } else {
      if (this.phone.startsWith('8')) {
        this.phone = '+7' + this.phone.slice(1);
      }
      if (!this.regexpPhone.test(this.phone)) {
        errors.phone = 'Некорректный формат номера телефона';
      }
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // Получить данные заказа
  getOrderLot() {
    return {
      items: this.items,
      payment: this.payment,
      total: this.total,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }
}