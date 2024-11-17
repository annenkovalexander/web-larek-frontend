import { CardFullSettings, GalleryItemSettings, ModalWindowSettings, PageSettings, ProductCartItemSettings, ShoppingCartSettings } from "../types";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
export const PRODUCT_URI = '/product';

export const pageSettings: PageSettings = {
    wrapper: '.page__wrapper',
    shoppingCartContainer: '.header__container',
    shoppingCartButton: '.header__basket',
    shoppingCartProductQuantity: '.header__basket-counter',
    productCardsContainer: '.gallery'
};

export const productCardSettings: GalleryItemSettings = {
    galleryItem: '.gallery__item',
    cardCategory: '.card__category',
    cardTitle: '.card__title',
    cardImage: '.card__image',
    cardPrice: '.card__price'
}

export const modalWindowSettings: ModalWindowSettings = {
    modal: '.modal',
    modalCloseButton: '.modal__close',
    modalActiveClass: 'modal_active',
    modalContent: '.modal__content'
}

export const cardFullSettings: CardFullSettings = {
    cardFull: '.card_full',
    cardImage: '.card__image',
    cardCategory: '.card__category',
    cardTitle: '.card__title',
    cardText: '.card__text',
    cardButton: '.card__button',
    cardPrice: '.card__price',
}

export const shoppingCartSettings: ShoppingCartSettings = {
    basket: '.basket',
    basketList: '.basket__list',
    basketPrice: '.basket__price',
    basketButton: '.basket__button'
}