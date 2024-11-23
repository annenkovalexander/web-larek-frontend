import { OrderStatusSettings, ShoppingCartProductsList } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class OrderStatus extends Component<Partial<ShoppingCartProductsList>>{
    protected _decriptionElement: HTMLElement;
    protected _totalSumElement: HTMLElement;
    protected _buyOnceMoreButton: HTMLButtonElement;


    constructor(protected readonly container: HTMLElement, orderStatusSettings: OrderStatusSettings, events: IEvents){
        super(container);
        this._decriptionElement = ensureElement<HTMLElement>(orderStatusSettings.orderSuccessDescription, container);
        this._buyOnceMoreButton = ensureElement<HTMLButtonElement>(orderStatusSettings.buyOnceMoreButton, container);
        this._buyOnceMoreButton.addEventListener('click', () => events.emit('close: successOrder'));
    }

    set totalSum (value:string){
        this.setText(this._decriptionElement, `Списано ${value} синапсов`);
    }

    getContainer(){
        return this.container;
    }
}