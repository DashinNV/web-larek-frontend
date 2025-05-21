import { IOrder } from "../../types";

export class Order implements IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[] = [];

    checkValidity() {
        
    };
}