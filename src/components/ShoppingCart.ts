import { ShoppingCartComponentData, ShoppingCartSettings } from "../types";
import { productCartItemSettings } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { getPriceText } from "./ProductCard";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class ShoppingCart extends Component<ShoppingCartComponentData> {
    protected _productList: HTMLElement[];
    protected _basketListContainerElement: HTMLElement;
    protected _basketPriceElement: HTMLElement;
    protected _basketButtonElement: HTMLButtonElement;

    constructor (protected readonly container: HTMLElement, shoppingCartSettings: ShoppingCartSettings, events: IEvents){
        super(container);
        this._basketListContainerElement = ensureElement<HTMLElement>(shoppingCartSettings.basketList, container);
        this._basketPriceElement = ensureElement<HTMLElement>(shoppingCartSettings.basketPrice, container);
        this._basketButtonElement = ensureElement<HTMLButtonElement>(shoppingCartSettings.basketButton, container);
        this._basketButtonElement.addEventListener('click', () => events.emit('shoppingCart:order'));
        this._basketButtonElement.disabled = true;
    }

    set productsList(value: HTMLElement[]){
        this._basketListContainerElement.replaceChildren(...value.map((item: HTMLElement, index:number) => {
            this.setText(item.querySelector(productCartItemSettings.basketItemIndex), String(index + 1));
            return item;
        }));
        this._basketButtonElement.disabled = !(value.length > 0);
    }

    set totalSum(value: number){
        this.setText(this._basketPriceElement, getPriceText(value));
    }

    getContainer(){
        return this.container;
    }
}