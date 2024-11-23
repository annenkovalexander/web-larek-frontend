import { PhoneAndEmailElements, PhoneAndEmailFormSettings, ShoppingCartProductsList } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class PhoneAndEmailForm extends Component<Partial<ShoppingCartProductsList> & {errorText?: string}>{
    protected _userPhoneElement: HTMLInputElement;
    protected _userEmailElement: HTMLInputElement;
    protected _buttonPayElement: HTMLButtonElement;
    protected _errorElement: HTMLElement;


    constructor(protected readonly container: HTMLFormElement, phoneAndEmailFormSettings: PhoneAndEmailFormSettings, events: IEvents){
        super(container);
        this._buttonPayElement = ensureElement<HTMLButtonElement>(phoneAndEmailFormSettings.buttonPay, container);
        const elements = container.elements as HTMLFormControlsCollection & PhoneAndEmailElements;
        this._userPhoneElement = elements['phone'] as HTMLInputElement;
        this._userEmailElement = elements['email'] as HTMLInputElement;
        this._userPhoneElement.addEventListener('input', () => events.emit("phone:change", {userPhone: this._userPhoneElement.value, userEmail: this._userEmailElement.value}));
        this._userEmailElement.addEventListener('input', () => events.emit("email:change", {userPhone: this._userPhoneElement.value, userEmail: this._userEmailElement.value}));
        this._errorElement = ensureElement<HTMLElement>(phoneAndEmailFormSettings.errorField, container);
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            events.emit('order:pay');
            this.container.reset();
            this._buttonPayElement.disabled = true;
        })
    }

    validateForm(userPhone: string | number, userEmail: string){
        let userPhoneDigitsList = String(userPhone).split("");
        userPhoneDigitsList = userPhoneDigitsList.filter((letter:string)=> letter.trim() && !isNaN(Number(letter)));
        const patternCheck = /[^a-zа-яё ]/iu.test(String(userPhone));
        const validationResult = userEmail.includes("@") && userEmail.split("@").length >= 2 && userEmail.split("@")[0] && userEmail.split("@")[1] && patternCheck && userPhoneDigitsList.length > 10;
        this._buttonPayElement.disabled = !validationResult;
        if (this._buttonPayElement.disabled)
            this.setText(this._errorElement, "Всё заполняй или уходи");
        else
            this.setText(this._errorElement, "");
    }

    set errorText(value:string) {
        this.setText(this._errorElement, value);
    }

    getContainer(){
        return this.container;
    }
}