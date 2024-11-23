import { PageComponentData, PageSettings } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Page extends Component<PageComponentData> {
    protected _productCardsContainer: HTMLElement;
    protected _shoppingCartContainer: HTMLElement;
    protected _shoppingCartButtonContainer: HTMLElement;
    protected _productCardsList: HTMLElement[];
    protected _chosenProductQuantityElement: HTMLElement;

    constructor(protected readonly container: HTMLElement, pageSettings: PageSettings, events: IEvents) {
        super(container);
        this._productCardsContainer = ensureElement<HTMLElement>(pageSettings.productCardsContainer, container);
        this._shoppingCartContainer = ensureElement<HTMLElement>(pageSettings.shoppingCartContainer, container);
        this._shoppingCartButtonContainer = ensureElement<HTMLElement>(pageSettings.shoppingCartButton, container);
        this._chosenProductQuantityElement = ensureElement<HTMLElement>(pageSettings.shoppingCartProductQuantity, this._shoppingCartContainer);
        this._shoppingCartButtonContainer.addEventListener('click', () => events.emit('shoppingCart:open'));
    };

    set productCardsList(value: HTMLElement[]) {
        Array.from(value).forEach((element) => {
            this._productCardsContainer.append(element);
        })
        
    }

    changeProductQuantity(value: number){
        this.setText(this._chosenProductQuantityElement, value);
    }
}