import { GalleryItemSettings, ProductItem } from "../types";
import { CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export const getPriceText = (value: number | string | null) => value ? value.toLocaleString().replace(/,/g, ' ') + ' синапсов': 'Бесценно';

export function getCardCategory(category: string){
    switch (category.toLowerCase().trim()){
        case "софт-скил": {
            return "soft";
        }
        case "хард-скил": {
            return "hard";
        }
        case "другое": {
            return "other";
        }
        case "дополнительное": {
            return "additional";
        }
        case "кнопка": {
            return "button";
        }
    }
}

export class ProductCard extends Component<ProductItem> {
    protected _cardCategoryElement: HTMLElement
    protected _cardTitleElement: HTMLElement;
    protected _cardImageElement: HTMLImageElement;
    protected _cardPriceElement: HTMLElement;

    constructor (template: HTMLTemplateElement, productCardSettings: GalleryItemSettings, events: IEvents, handleClick: Function){
        const container = template.content.querySelector(productCardSettings.galleryItem).cloneNode(true) as HTMLElement;
        super(container);
        this._cardCategoryElement = ensureElement<HTMLElement>(productCardSettings.cardCategory, container);
        this._cardTitleElement = ensureElement<HTMLElement>(productCardSettings.cardTitle, container);
        this._cardImageElement = ensureElement<HTMLImageElement>(productCardSettings.cardImage, container);
        this._cardPriceElement = ensureElement<HTMLElement>(productCardSettings.cardPrice, container);
        this.container.addEventListener('click', (item) => handleClick(item));
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
    }
}