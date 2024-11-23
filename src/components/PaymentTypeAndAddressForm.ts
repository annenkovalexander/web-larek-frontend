import { OrderElements, PaymentType, PaymentTypeAndAddressFormSettings, ShoppingCartComponentData } from "../types";
import { paymentTypeAndAddressFormSettings } from "../utils/constants";
import { ensureElement, log } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class PaymentTypeAndAddressForm extends Component<Partial<ShoppingCartComponentData>> {
    protected _buttonElement: HTMLButtonElement;
    protected _formElement: HTMLFormElement;
    protected _addressField: HTMLInputElement;
    protected _errorElement: HTMLElement;
    protected _buttonCardElement: HTMLButtonElement;
    protected _buttonCashElement: HTMLElement;


    constructor(protected readonly container: HTMLFormElement, paymentTypeAndAddressFormSettings: PaymentTypeAndAddressFormSettings, events: IEvents){
        super(container);
        this._buttonElement = ensureElement<HTMLButtonElement>(paymentTypeAndAddressFormSettings.buttonNext, container);
        const elements = container.elements as HTMLFormControlsCollection & OrderElements;
        this._addressField = elements['address'] as HTMLInputElement;
        this._addressField.addEventListener('input', ()=>events.emit('address:change', {address: this._addressField.value}));
        this._buttonCardElement = elements['card'] as HTMLButtonElement;
        this._buttonCashElement = elements['cash'] as HTMLButtonElement;
        this._errorElement = ensureElement<HTMLElement>(paymentTypeAndAddressFormSettings.formErrors, container);
        this._buttonCardElement.addEventListener('click', () => events.emit('paymentType:change', {address: this._addressField.value, paymentType: PaymentType['online']}));
        this._buttonCashElement.addEventListener('click', () => events.emit('paymentType:change', {address: this._addressField.value, paymentType: PaymentType['offline']}));
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            events.emit('order:next');
            this.container.reset();
            this._buttonElement.disabled = true;
            this._buttonCardElement.classList.remove(paymentTypeAndAddressFormSettings.buttonAltActiveClass);
            this._buttonCardElement.classList.add(paymentTypeAndAddressFormSettings.buttonAltClass);     
        });
    }

    validateForm(address: string, paymentType: PaymentType){
        this._buttonElement.disabled = !(address && address.length > 0 && Boolean(PaymentType[paymentType]));
        if (this._buttonElement.disabled){
            this.setText(this._errorElement, 'Подумай, ты точно хочешь идти дальше...');
        } else {
            this.setText(this._errorElement, '');
        }
    }

    toggleButtons(paymentType: PaymentType){
        if (paymentType === 0){
            this._buttonCardElement.classList.remove(paymentTypeAndAddressFormSettings.buttonAltClass);
            this._buttonCardElement.classList.add(paymentTypeAndAddressFormSettings.buttonAltActiveClass);
            this._buttonCashElement.classList.add(paymentTypeAndAddressFormSettings.buttonAltClass);
            this._buttonCashElement.classList.remove(paymentTypeAndAddressFormSettings.buttonAltActiveClass);
        } else if (paymentType === 1){
            this._buttonCardElement.classList.add(paymentTypeAndAddressFormSettings.buttonAltClass);
            this._buttonCardElement.classList.remove(paymentTypeAndAddressFormSettings.buttonAltActiveClass);
            this._buttonCashElement.classList.remove(paymentTypeAndAddressFormSettings.buttonAltClass);
            this._buttonCashElement.classList.add(paymentTypeAndAddressFormSettings.buttonAltActiveClass);
        }
    }

    getContainer(){
        return this.container;
    }
}