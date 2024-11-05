//Описание типов модели данных

export type ProductItem = {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number
}

export type ProductData = {
    productsQuantity: number,
    productItems: ProductItem[]
}

export type ProductCart = {
    chosenProductsNumber: number,
    chosenProducts: ProductItem[],
    paymentType: boolean,
    userEmail: string,
    userPhone: string | number,
    deliveryAddress: string
}

export type ProductOrderResult = {
    id?: string,
    total?: number,
    error?: string
}

export interface IProductAPI {
    getProductList: () => Promise<ProductItem[]>,
    getProductInfo: (id:string) => Promise<ProductItem>,
    orderProducts: (order: ProductCart) => Promise<ProductOrderResult>
}

export type PageSettings = {
    wrapper: string,
    headerBusketCounter: string,
    gallery: string
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
    modalContent: string
}

export type ShoppingCartSettings = {
    basket: string,
    basketList: string,
    basketPrice: string
}

export type ProductCartItemSettings = {
    basketItem: string,
    basketItemIndex: number,
    cardTitle: string,
    cardPrice: string,
    itemDeletButton: string
}

export type OrderStep1Settings = {
    formName: string,
    cardButtonName: string,
    cashButtonName: string,
    addressFieldName: string
}

export type OrderStep2Settings = {
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

export type ProductOpenEvent = {
    cardId: number
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