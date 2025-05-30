import { cloneTemplate, ensureElement, ensureAllElements } from '../../utils/utils';
import { EventEmitter } from '../base/events';

export class BillingView {
	public template: HTMLElement;
	private events: EventEmitter;
	private buttonPayment: HTMLButtonElement[];
	private inputAddress: HTMLInputElement;
	private nextButton: HTMLButtonElement;
	private errorContainer: HTMLElement;
	private selectedPaymentMethod: string =``;
	
	constructor(broker: EventEmitter) {
        this.events = broker;
        this.template = cloneTemplate<HTMLTemplateElement>(`#order`);
        this.buttonPayment = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.template);
        this.inputAddress = ensureElement<HTMLInputElement>('input[name="address"]', this.template);
        this.nextButton = ensureElement<HTMLButtonElement>('.order__button', this.template);
        this.errorContainer = ensureElement<HTMLElement>('.form__errors', this.template);



		// Добавляем обработчики на кнопки выбора оплаты
		this.buttonPayment.forEach(button => {
			button.addEventListener('click', () => {
			  this.selectPaymentMethod(button.name);
			  this.validation();
			  this.updateButtonStyles(button);
			});
		  });

		 // Обработчик ввода адреса
		this.inputAddress.addEventListener('input', () => this.validation());

		this.nextButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.events.emit('billingView:success', {
				payment: this.selectedPaymentMethod,
				address: this.inputAddress.value,
			});
		});
	}
	
	public validation(): void {
		const paymentValue = this.selectedPaymentMethod;
		const addressValue = this.inputAddress.value;
		this.nextButton.disabled = true;
		
		this.events.emit('validation:billingView', {
		  payment: {
			  field: this.selectedPaymentMethod,
			  value: paymentValue
		  },
		  address: {
			  field: this.inputAddress.name,
			  value: addressValue
		  }
		})
	}

	public setSubmitButtonState(isEnabled: boolean) {
		this.nextButton.disabled = !isEnabled;
	}
	
	public showError(message: string) {
		this.errorContainer.textContent = message;
		this.errorContainer.style.display = 'block';
	}
	
	
	public clear(): void {
		this.selectedPaymentMethod = '';
		this.inputAddress.value = '';
		this.setSubmitButtonState(false);
	}
	
	public clearErrors() {
		this.errorContainer.textContent = '';
		this.errorContainer.style.display = 'none';
	}
	
	private selectPaymentMethod(method: string) {
        this.selectedPaymentMethod = method;
    }

	private updateButtonStyles(selectedButton: HTMLButtonElement) {
        this.buttonPayment.forEach(button => {
        	button.classList.remove('button_alt-active'); 
    	});
    	selectedButton.classList.add('button_alt-active');
	}

}