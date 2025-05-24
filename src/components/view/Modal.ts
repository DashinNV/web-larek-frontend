import { ensureElement } from '../../utils/utils';

export class Modal {
    private modalContainer: HTMLElement;
    private modalContent: HTMLElement;
    private content: HTMLElement | null = null;
    private submitButton?: HTMLButtonElement;
    private closeButton: HTMLButtonElement;

    constructor() {
        this.modalContainer = ensureElement<HTMLElement>('#modal-container');
        this.modalContent = ensureElement<HTMLElement>('.modal__content', this.modalContainer);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.modalContainer);

        this.closeButton.addEventListener('click', () => this.close());
        this.modalContainer.addEventListener('click', (event: Event) => {
            if (event.target === this.modalContainer) this.close();
        });
    }

    public setContent(content: HTMLElement): void {
        this.content = content;
        this.submitButton = ensureElement<HTMLButtonElement>('.button', content);
        this.modalContent.replaceChildren(content);
    }

    public setButtonText(text: string): void {
        if (this.submitButton) {
            this.submitButton.textContent = text;
        }
    }

    public open(): void {
        this.modalContainer.classList.add('modal_active');
        document.addEventListener('keydown', this.handleEscClose);
    }

    public close(): void {
        this.modalContainer.classList.remove('modal_active');
        this.modalContent.textContent = '';
        document.removeEventListener('keydown', this.handleEscClose);
    }

    private handleEscClose = (evt: KeyboardEvent): void => {
        if (evt.key === 'Escape') this.close();
    }
}