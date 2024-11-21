import { CardFullSettings, GalleryItemSettings, ModalWindowSettings, OrderStatusSettings, PageSettings, PaymentTypeAndAddressFormSettings, PhoneAndEmailFormSettings, ProductCartItemSettings, ShoppingCartSettings } from "../types";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
export const PRODUCT_URI = '/product';
export const ORDER_URI = '/order'

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

export const productCartItemSettings: ProductCartItemSettings = {
    basketItem: '.basket__item',
    basketItemIndex: '.basket__item-index',
    cardTitle: '.card__title',
    cardPrice: '.card__price',
    itemDeletButton: '.basket__item-delete',
}

export const paymentTypeAndAddressFormSettings: PaymentTypeAndAddressFormSettings = {
    formClass: '.form',
    formName: 'order',
    addressField: '',
    buttonCardName: 'card',
    buttonCashName: 'cash',
    addressFieldName: 'address',
    buttonNext: '.order__button',
    formErrors: '.form__errors',
    buttonAltClass: 'button_alt',
    buttonAltActiveClass: 'button_alt-active'
}

export const phoneAndEmailFormSettings: PhoneAndEmailFormSettings = {
    formClass: '.form',
    formName: 'contacts',
    emailFieldName: 'email',
    phoneFieldName: 'phone',
    buttonPay: '.button',
    errorField: '.form__errors'
}

export const orderStatusSettings: OrderStatusSettings = {
    orderStatus: '.order-success',
    orderSuccessDescription: '.order-success__description',
    buyOnceMoreButton: '.order-success__close'
}