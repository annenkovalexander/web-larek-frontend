import { CardFullSettings, ProductItem } from "../types";
import { CDN_URL } from "../utils/constants";
import { ensureElement, log } from "../utils/utils";
import { getCardCategory, getPriceText } from "./ProductCard";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export class ProductFullInfo extends Component<ProductItem & {buttonStatus: boolean}> {
    protected _cardImageElement: HTMLImageElement;
    protected _cardCategoryElement: HTMLElement;
    protected _cardTitleElement: HTMLElement;
    protected _cardTextElement: HTMLElement;
    protected _cardPriceElement: HTMLElement;
    protected _cardButtonElement: HTMLButtonElement;

    constructor (protected readonly container: HTMLElement, cardFullSettings: CardFullSettings, events: IEvents){
        super(container);
        this._cardImageElement = ensureElement<HTMLImageElement>(cardFullSettings.cardImage, container);
        this._cardCategoryElement = ensureElement<HTMLElement>(cardFullSettings.cardCategory, container);
        this._cardTitleElement = ensureElement<HTMLElement>(cardFullSettings.cardTitle, container);
        this._cardTextElement = ensureElement<HTMLElement>(cardFullSettings.cardText, container);
        this._cardPriceElement = ensureElement<HTMLElement>(cardFullSettings.cardPrice, container);
        this._cardButtonElement = ensureElement<HTMLButtonElement>(cardFullSettings.cardButton, container);
        this._cardButtonElement.addEventListener('click', () => {
            this._cardButtonElement.disabled = true;
            this.setText(this._cardButtonElement, 'Уже в корзине');
            events.emit('shoppingCart:add', {});
        });
    }


    set description(value: string) {
        this.setText(this._cardTextElement, value);
    }

    set image(value: string) {
        this.setImage(this._cardImageElement, CDN_URL + value);
    }

    set title(value: string) {
        this.setText(this._cardTitleElement, value);
    }

    set category(value: string) {
        this.setText(this._cardCategoryElement, value);
        this._cardCategoryElement.classList.add("card__category_" + getCardCategory(value));
    }

    set price(value: string) {
        this.setText(this._cardPriceElement, getPriceText(value));
        if (!value){
            this.setText(this._cardButtonElement, 'Не продаётся');
            this._cardButtonElement.disabled = true;
        }
    }

    set buttonStatus(value: boolean) {
        this._cardButtonElement.disabled = this._cardButtonElement.disabled ? true : !value;
        if (!value)
            this.setText(this._cardButtonElement, 'Уже в корзине');
    }
}