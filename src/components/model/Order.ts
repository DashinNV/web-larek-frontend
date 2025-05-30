import { IOrder } from "../../types";

export class Order implements IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[] = [];

    private regexpAddress = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
  	private regexpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  	private regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;

	public validationAddress(address: string): string | null {
		return this.regexpAddress.test(address) ? null: `Укажите правильный адрес`;
	}

	public validationPayment(payment: string): string | null {
		return payment.trim() !== `` ? null: `Необходимо выбрать метод оплаты`;
	}

	public validateEmail(email: string): string | null {
		return this.regexpEmail.test(email) ? null : 'Некорректный адрес электронной почты';
    }

    public validatePhone(phone: string): string | null {
        return this.regexpPhone.test(phone) ? null :`Некорректный формат номера телефона`;
    }
}