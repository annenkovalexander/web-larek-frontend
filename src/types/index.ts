//Описание типов модели данных

export type ProductItem = {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number | null
}

export type ProductData = {
    total: number,
    items: ProductItem[]
}

export enum PaymentType {
    'online',
    'offline'
}


export type ShoppingCartProductsList = {
    paymentType?: PaymentType,
    userEmail?: string,
    userPhone?: string | number,
    deliveryAddress?: string
    chosenProductsNumber: number,
    chosenProducts?: string[],
    totalSum?: number
}

export type ProductOrderResult = {
    id?: string,
    total?: number,
    error?: string
}

export interface ILarekAPI {
    getProductList: (uri: string) => Promise<ProductData | object>,
    getProductInfo: (uri: string, id:string) => Promise<ProductItem | object>,
    orderProducts: (uri: string, order: ShoppingCartProductsList) => Promise<ProductOrderResult | object>
}

//Типы модели отображения

export type PageComponentData = {
    productQuanity: number,
    productCardsList: HTMLElement[]
}

export type ProductCardComponentData = {
    productId: string,
    productDescription: string,
    productImageSourceUri: string,
    productName: string,
    productCategory: string,
    productPrice: number 
}

export type ModalComponentData = {
    contentElement: HTMLElement,
    openFlag: boolean
}

export type ShoppingCartComponentData = {
    productsList: Partial<ProductItem>[],
    totalSum: number
}

//Типы настроек

export type PageSettings = {
    wrapper: string,
    productCardsContainer: string,
    shoppingCartContainer: string,
    shoppingCartButton: string,
    shoppingCartProductQuantity: string
}

export type GalleryItemSettings = {
    galleryItem: string,
    cardCategory: string,
    cardTitle: string,
    cardImage: string,
    cardPrice: string
}

export type ModalWindowSettings = {
    modal: string,
    modalCloseButton: string,
    modalActiveClass: string,
    modalContent: string
}

export type CardFullSettings = {
    cardFull: string,
    cardImage: string,
    cardCategory: string,
    cardTitle: string,
    cardText: string,
    cardButton: string,
    cardPrice: string
}

export type ShoppingCartSettings = {
    basket: string,
    basketList: string,
    basketPrice: string,
    basketButton: string
}

export type ProductCartItemSettings = {
    basketItem: string,
    basketItemIndex: string,
    cardTitle: string,
    cardPrice: string,
    itemDeletButton: string
}

export type PaymentTypeAndAddressFormSettings = {
    formName: string,
    cardButtonName: string,
    cashButtonName: string,
    addressFieldName: string
}

export type PhoneAndEmailFormSettings = {
    formName: string,
    emailFieldName: string,
    phoneFieldName: string
}

export type OrderStatusSettings = {
    orderSuccessDescription: string
}

//События и типы данных, передаваемых в событии

export enum Events {
    CHANGE_PRODUCT_DATA = "productData:change", // изменение массива данных по карточкам
    PRODUCT_OPEN = "product:open", // клик по карточке продукта
    SHOPPING_CART_ADD = "shoppingCart:add", // кнопка "Добавить" нажата
    SHOPPING_CART_OPEN = "shoppingCart:open", // Кнопка "Корзина" нажата
    SHOPPING_CART_ORDER = "shoppingCart:order", //Кнопка оформить нажата 
    SHOPPING_CART_ORDER_NEXT = "order:next", // Кнопка "Далее" нажата
    SHOPPING_CART_ORDER_PAY = "order:pay" // Кнопка "Оплатить" нажата
}

export type ProductDataEvent = {
    productData: ProductData
}

export type ShoppingCartAdd = {
    productId: string
}

export type ModalType = {
    openModal: boolean
}

export type OrderNextType = {
    paymentType: boolean,
    deliveryAddress: string
}

export type OrderData = {
    productsNumber: number,
    paymentType: boolean,
    email: string,
    phone: string,
    deliveryAddress: string,
    productListIds: string[]
}