import { ProductCartItemSettings, ProductItem } from "../types";
import { ensureElement } from "../utils/utils";
import { getPriceText } from "./ProductCard";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class ProductCartItem extends Component<Partial<ProductItem> & {listNumber: number}> {
    protected _listItemElement: HTMLElement;
    protected _titleElement: HTMLElement;
    protected _priceElement: HTMLElement;
    protected _buttonElement: HTMLButtonElement;
    protected _container: HTMLElement;

    constructor(template: HTMLTemplateElement, productItemSettings: ProductCartItemSettings, protected readonly events: IEvents){
        const container = template.content.querySelector(productItemSettings.basketItem).cloneNode(true) as HTMLElement;
        super(container);
        this._listItemElement = ensureElement<HTMLElement>(productItemSettings.basketItemIndex, container);
        this._titleElement = ensureElement<HTMLElement>(productItemSettings.cardTitle, container);
        this._priceElement = ensureElement<HTMLElement>(productItemSettings.cardPrice, container);
        this._buttonElement = ensureElement<HTMLButtonElement>(productItemSettings.itemDeletButton, container);
    }

    set id(value: string) {
        this._buttonElement.addEventListener('click', () => this.events.emit('product:delete', {id: value}))
    }

    set title(value: string) {
        this.setText(this._titleElement, value);
    }

    set price(value: string) {
        this.setText(this._priceElement, getPriceText(value));
    }
}