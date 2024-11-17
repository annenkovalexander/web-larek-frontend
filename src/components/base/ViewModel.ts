import { CardFullSettings, GalleryItemSettings, ModalComponentData, ModalWindowSettings, PageComponentData, PageSettings, ProductCardComponentData, ProductCartItemSettings, ProductItem, ShoppingCartComponentData, ShoppingCartSettings } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";
import { log } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { IEvents } from "./events";

const detectClickOutside = (element: HTMLElement, activeClass: string) => {

    
    const handleClickOutside = (event: any) => {
        if (element.classList.contains(activeClass) && event.target.contains(element)){
            element.classList.remove(activeClass);
        }
    }
    document.addEventListener('click', handleClickOutside)

    return () => {
        document.removeEventListener('click', handleClickOutside);
    }
    
}

const getPriceText = (value: number | string | null) => value ? value.toLocaleString().replace(/,/g, ' ') + ' синапсов': 'Бесценно'

export class Page extends Component<PageComponentData> {
    protected _productCardsContainer: HTMLElement;
    protected _shoppingCartContainer: HTMLElement;
    protected _shoppingCartButtonContainer: HTMLElement;
    protected _productCardsList: HTMLElement[];
    protected _chosenProductsNumber: number;
    protected _pageSettings: PageSettings

    constructor(protected readonly container: HTMLElement, pageSettings: PageSettings, events: IEvents) {
        super(container);
        this._pageSettings = pageSettings;
        this._productCardsContainer = ensureElement<HTMLElement>(this._pageSettings.productCardsContainer, container);
        this._shoppingCartContainer = ensureElement<HTMLElement>(this._pageSettings.shoppingCartContainer, container);
        this._shoppingCartButtonContainer = ensureElement<HTMLElement>(this._pageSettings.shoppingCartButton, container);
        this._shoppingCartButtonContainer.addEventListener('click', () => events.emit('shoppingCart:open'));
    };

    set productQuanity(value: number) {
        this._chosenProductsNumber = value;
        const chosenProductQuantityElement = ensureElement<HTMLElement>(this._pageSettings.shoppingCartProductQuantity, this._shoppingCartContainer);
        this.setText(chosenProductQuantityElement, value);
    }

    set productCardsList(value: HTMLElement[]) {
        Array.from(value).forEach((element) => {
            this._productCardsContainer.append(element);
        })
        
    }
}

export class ProductCard extends Component<ProductItem> {
    protected _cardCategoryElement: HTMLElement
    protected _cardTitleElement: HTMLElement;
    protected _cardImageElement: HTMLImageElement;
    protected _cardPriceElement: HTMLElement;
    protected _productId: string;
    protected _productDescription: string;
    protected _productImageSourceUri: string;
    protected _productName: string;
    protected _productCategory: string;
    protected _productPrice: string;

    constructor (protected readonly container: HTMLElement, productCardSettings: GalleryItemSettings, events: IEvents){
        super(container);
        container.addEventListener('click', (event) => events.emit('product:open', {
            id: this._productId,
            description: this._productDescription,
            image: this._productImageSourceUri,
            title: this._productName,
            category: this._productCategory,
            price: this._productPrice
        }));
        this._cardCategoryElement = ensureElement<HTMLElement>(productCardSettings.cardCategory, container);
        this._cardTitleElement = ensureElement<HTMLElement>(productCardSettings.cardTitle, container);
        this._cardImageElement = ensureElement<HTMLImageElement>(productCardSettings.cardImage, container);
        this._cardPriceElement = ensureElement<HTMLElement>(productCardSettings.cardPrice, container);
    }

    set id(value: string) {
        this._productId = value;
    }

    set description(value: string) {
        this._productDescription = value;
    }

    set image(value: string) {
        this._productImageSourceUri = value;
        this.setImage(this._cardImageElement, CDN_URL + value);
    }

    set title(value: string) {
        this._productName = value;
        this.setText(this._cardTitleElement, value);
    }

    set category(value: string) {
        this._productCategory = value;
        this.setText(this._cardCategoryElement, value);
    }

    set price(value: string) {
        this._productPrice = value;
        this.setText(this._cardPriceElement, getPriceText(value));
    }
}

export class ModalComponent extends Component<ModalComponentData> {
    protected _contentElement: HTMLElement;
    protected _openFlag: boolean;
    protected _modalWindowSettings: ModalWindowSettings;
    protected _contentElementChild: HTMLElement;

    constructor(protected readonly container: HTMLElement, modalWindowSettings: ModalWindowSettings, events: IEvents){
        super(container);
        const closeButton = ensureElement<HTMLButtonElement>(modalWindowSettings.modalCloseButton, container);
        closeButton.addEventListener('click', () => {
            if (container.classList.contains(modalWindowSettings.modalActiveClass))
                container.classList.remove(modalWindowSettings.modalActiveClass)
        })
        this._contentElement = ensureElement<HTMLElement>(modalWindowSettings.modalContent, container);
        this._modalWindowSettings = modalWindowSettings;
        detectClickOutside(this.container, this._modalWindowSettings.modalActiveClass);
    }

    set contentElement(value: HTMLElement) {
        const children = Array.from(this._contentElement.childNodes);
        children.forEach(child => {
            this._contentElement.removeChild(child);
        });
        this._contentElement.append(value);
    }

    set openFlag(value: boolean){
        this._openFlag = value;
        if (this._openFlag && !this.container.classList.contains(this._modalWindowSettings.modalActiveClass)){
            this.container.classList.add(this._modalWindowSettings.modalActiveClass);
        }
            
        else if (!this._openFlag && this.container.classList.contains(this._modalWindowSettings.modalActiveClass)){
            this.container.classList.remove(this._modalWindowSettings.modalActiveClass);
            this._contentElement.removeChild(this._contentElementChild);
        }
            
    }
}

export class ProductFullInfo extends Component<ProductItem> {
    protected _productId: string;
    protected _productDescription: string;
    protected _productImageSourceUri: string;
    protected _productName: string;
    protected _productCategory: string;
    protected _productPrice: string;
    protected _cardImageElement: HTMLImageElement;
    protected _cardCategoryElement: HTMLElement;
    protected _cardTitleElement: HTMLElement;
    protected _cardTextElement: HTMLElement;
    protected _cardPriceElement: HTMLElement;
    protected _cardButtonElement: HTMLElement;

    constructor (protected readonly container: HTMLElement, cardFullSettings: CardFullSettings, events: IEvents){
        super(container);
        this._cardImageElement = ensureElement<HTMLImageElement>(cardFullSettings.cardImage, container);
        this._cardCategoryElement = ensureElement<HTMLElement>(cardFullSettings.cardCategory, container);
        this._cardTitleElement = ensureElement<HTMLElement>(cardFullSettings.cardTitle, container);
        this._cardTextElement = ensureElement<HTMLElement>(cardFullSettings.cardText, container);
        this._cardPriceElement = ensureElement<HTMLElement>(cardFullSettings.cardPrice, container);
        this._cardButtonElement = ensureElement<HTMLElement>(cardFullSettings.cardButton, container);
        this._cardButtonElement.addEventListener('click', () => events.emit('shoppingCart:add', {
            productId: this._productId
        }))
    }

    set id(value: string) {
        this._productId = value;
    }

    set description(value: string) {
        this._productDescription = value;
        this.setText(this._cardTextElement, this._productDescription);
    }

    set image(value: string) {
        this._productImageSourceUri = value;
        this.setImage(this._cardImageElement, CDN_URL + this._productImageSourceUri);
    }

    set title(value: string) {
        this._productName = value;
        this.setText(this._cardTitleElement, this._productName);
    }

    set category(value: string) {
        this._productCategory = value;
        this.setText(this._cardCategoryElement, this._productCategory);
    }

    set price(value: string) {
        this._productPrice = value;
        this.setText(this._cardPriceElement, getPriceText(this._productPrice));
    }
}

export class ShoppingCart extends Component<ShoppingCartComponentData> {
    protected _productList: HTMLElement[];
    protected _totalSum: number;
    protected _basketListContainerElement: HTMLElement;
    protected _basketPriceElement: HTMLElement;
    protected _basketButtonElement: HTMLButtonElement;

    constructor (protected readonly container: HTMLElement, shoppingCartSettings: ShoppingCartSettings, events: IEvents){
        super(container);
        this._basketListContainerElement = ensureElement<HTMLElement>(shoppingCartSettings.basketList, container);
        this._basketPriceElement = ensureElement<HTMLElement>(shoppingCartSettings.basketPrice, container);
        this._basketButtonElement = ensureElement<HTMLButtonElement>(shoppingCartSettings.basketButton, container);
        this._basketButtonElement.addEventListener('click', () => events.emit('shoppingCart:order'));
    }

    set productsList(value: HTMLElement[]){
        Array.from(value).forEach(element => {
            this._basketListContainerElement.append(element);
        });   
    }

    set totalSum(value: number){
        this.setText(this._basketPriceElement, getPriceText(value));
    }
}

export class ProductCartItem extends Component<Partial<ProductItem> & {listNumber: number}> {
    protected _productId: string;
    protected _listItem: string;
    protected _title: string;
    protected _price: string;
    protected _listItemElement: HTMLElement;
    protected _titleElement: HTMLElement;
    protected _priceElement: HTMLElement;
    protected _buttonElement: HTMLButtonElement;

    constructor(protected readonly container: HTMLElement, productItemSettings: ProductCartItemSettings, events: IEvents){
        super(container);
        this._listItemElement = ensureElement<HTMLElement>(productItemSettings.basketItemIndex, container);
        this._titleElement = ensureElement<HTMLElement>(productItemSettings.cardTitle, container);
        this._priceElement = ensureElement<HTMLElement>(productItemSettings.cardPrice, container);
        this._buttonElement = ensureElement<HTMLButtonElement>(productItemSettings.itemDeletButton, container);
        this._buttonElement.addEventListener('click', () => events.emit('product:delete', {
            id: this._productId
        }))
    }

    set id(value: string){
        this._productId = value;
    }

    set listNumber(value: number) {
        this.setText(this._listItemElement, value);
    }

    set title(value: string) {
        this.setText(this._titleElement, value);
    }

    set price(value: string) {
        this.setText(this._priceElement, value);
    }
}