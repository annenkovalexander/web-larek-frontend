import './scss/styles.scss';
import { ProductListModel, ShoppingCartProductListModel, appState, convertToOrderBodyData } from './components/base/DataModel';
import { EventEmitter } from './components/base/events';
import { ProductData, ProductItem, ShoppingCartProductsList, AddressChangeEventData, PaymentTypeEventData, PhoneChangeEventData, ProductOrderResult, OrderBodyData } from './types';
import { LarekAPI } from './components/base/larekAPI';
import { log } from './utils/utils';
import { API_URL, PRODUCT_URI, ORDER_URI, paymentTypeAndAddressFormSettings, phoneAndEmailFormSettings } from './utils/constants';
import { pageSettings, productCardSettings, modalWindowSettings, cardFullSettings, shoppingCartSettings, productCartItemSettings, orderStatusSettings } from './utils/constants';


import { ShoppingCart } from './components/ShoppingCart';
import { ProductFullInfo } from './components/ProductFullInfo';
import { ProductCartItem } from './components/ProductCartItem';
import { ProductCard } from './components/ProductCard';
import { PhoneAndEmailForm } from './components/PhoneAndEmailForm';
import { PaymentTypeAndAddressForm } from './components/PaymentTypeAndAddressForm';
import { Page } from './components/Page';
import { ModalComponent } from './components/ModalWindow';
import { OrderStatus } from './components/OrderStatus';




const events = new EventEmitter();
const pageComponent = new Page(document.querySelector(pageSettings.wrapper), pageSettings, events);
const modalComponent = new ModalComponent(document.querySelector(modalWindowSettings.modal), modalWindowSettings, events);

const cardComponentTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const fullProductInfoTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const shoppingCartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const productCartItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const paymentTypeAndAddressFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const phoneAndEmailFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const orderStatusTemplate = document.querySelector('#success') as HTMLTemplateElement;

const paymentTypeAndAddressForm = new PaymentTypeAndAddressForm(paymentTypeAndAddressFormTemplate.content.querySelector(paymentTypeAndAddressFormSettings.formClass).cloneNode(true) as HTMLFormElement, paymentTypeAndAddressFormSettings, events);
const phoneAndEmailForm = new PhoneAndEmailForm(phoneAndEmailFormTemplate.content.querySelector(phoneAndEmailFormSettings.formClass).cloneNode(true) as HTMLFormElement, phoneAndEmailFormSettings, events);
const shoppingCart = shoppingCartTemplate.content.querySelector(shoppingCartSettings.basket).cloneNode(true) as HTMLElement;
const shoppingCartComponent = new ShoppingCart(shoppingCart, shoppingCartSettings, events);
const orderStatusComponent = new OrderStatus(orderStatusTemplate.content.querySelector(orderStatusSettings.orderStatus).cloneNode(true) as HTMLHtmlElement, orderStatusSettings, events);




const getProductData = (productIds: string[]): ProductItem[] => {
    const allProducts = productDataModel.getProductList();
    let productItems: ProductItem[] = [];
    productIds.forEach((id:string) => {
        let filteredData: ProductItem[] = allProducts.filter((productItem: ProductItem) => {
            return productItem.id == id;
        });
        if (filteredData && filteredData.length === 1)
            productItems.push(filteredData[0]);
    });
    return productItems;
}

const orderData = (orderBodyData: OrderBodyData): Promise<ProductOrderResult | void> => {
    return larekAPI.orderProducts(ORDER_URI, orderBodyData);
}


const productListInitialState: ProductData = {
    total: 0,
    items: []
}

const shoppingCartInitialState: ShoppingCartProductsList = {
    chosenProductsNumber: 0,
    chosenProducts: []
}

const productDataModel = new ProductListModel(productListInitialState, events);
const shoppingCartDataModel = new ShoppingCartProductListModel(shoppingCartInitialState, events);
const larekAPI = new LarekAPI(API_URL);

larekAPI.getProductList(PRODUCT_URI).then((data:ProductData)=>productDataModel.updateData(data)).catch(err => log("Ошибка получения данных", err));


events.on('productData:change', (data: ProductData)=>{
    let cardsList: HTMLElement[] = [];
    data.items.forEach((item: ProductItem) => {
        const cardComponent = cardComponentTemplate.content.querySelector(productCardSettings.galleryItem).cloneNode(true) as HTMLElement;
        const updatedCardComponent = new ProductCard(cardComponent, productCardSettings, events).render(item);
        updatedCardComponent.addEventListener('click', () => events.emit('product:open', item));
        cardsList.push(updatedCardComponent);
    });
    pageComponent.render({
        productCardsList: cardsList
    })
});

events.on('product:open', (data: ProductItem & {buttonStatus: boolean}) => {
    const productInfoContent = fullProductInfoTemplate.content.querySelector(cardFullSettings.cardFull).cloneNode(true) as HTMLElement;
    data.buttonStatus = shoppingCartDataModel.getButtonStatus(data.id);
    appState.activeId = data.id;
    const productFullInfo = new ProductFullInfo(productInfoContent, cardFullSettings, events).render(data);
    modalComponent.render({
        contentElement: productFullInfo,
        openFlag: true
    })
});

events.on('shoppingCart:add', () => {
    shoppingCartDataModel.addNewProduct(appState.activeId);
})

events.on('chosenProducts:change', (chosenProductsData: Partial<ShoppingCartProductsList>) => {
    if (chosenProductsData.chosenProducts.length === 0){
        pageComponent.changeProductQuantity(0);
        shoppingCartComponent.render({
            productsList: [],
            totalSum: 0
        })
    } else{
        const data = getProductData(chosenProductsData.chosenProducts);
        let chosenProductsComponents: HTMLElement[] = [];
        let totalSum: number = 0;
        data.forEach((productItem: ProductItem, index: number) => {
            const productCartItemElement = productCartItemTemplate.content.querySelector(productCartItemSettings.basketItem).cloneNode(true) as HTMLElement;
            const productCartItem = new ProductCartItem(productCartItemElement, productCartItemSettings, events);
            chosenProductsComponents.push(productCartItem.render(Object.assign(productItem, {listNumber: index+1})));
            totalSum += productItem.price ? productItem.price : 0;
        });
        shoppingCartComponent.render({
            productsList: chosenProductsComponents,
            totalSum: totalSum
        });
        shoppingCartDataModel.updateData({
            totalSum: totalSum
        })
        pageComponent.changeProductQuantity(chosenProductsData.chosenProductsNumber)
    }
})

events.on('shoppingCart:open', () => {
    const shoppingCartData = shoppingCartDataModel.getShoppingCart();
    

    modalComponent.render({
        contentElement: shoppingCartComponent.getContainer(),
        openFlag: true
    })
});

events.on('product:delete', (data:Partial<ProductItem>) => {
    shoppingCartDataModel.deleteProduct(data.id);
})

events.on('shoppingCart:order', () => {
    modalComponent.render({
        contentElement: paymentTypeAndAddressForm.getContainer(),
        openFlag: true
    })
})


events.on('address:change', (data: AddressChangeEventData) => {
    shoppingCartDataModel.updateData({
        deliveryAddress: data.address
    });
    paymentTypeAndAddressForm.validateForm(data.address, shoppingCartDataModel.getShoppingCart().paymentType);
});

events.on('paymentType:change', (data: PaymentTypeEventData) => {
    shoppingCartDataModel.updateData({
        paymentType: data.paymentType
    })
    paymentTypeAndAddressForm.validateForm(shoppingCartDataModel.getShoppingCart().deliveryAddress, data.paymentType);
    paymentTypeAndAddressForm.toggleButtons(data.paymentType);
});

events.on('order:next', () => {
    modalComponent.render({
        contentElement: phoneAndEmailForm.getContainer(),
        openFlag: true
    })

});

events.on('phone:change', (data: PhoneChangeEventData) => {
    phoneAndEmailForm.validateForm(data.userPhone, data.userEmail);
    shoppingCartDataModel.updateData(data);
});

events.on('email:change', (data: PhoneChangeEventData) => {
    phoneAndEmailForm.validateForm(data.userPhone, data.userEmail);
    shoppingCartDataModel.updateData(data);
});

events.on('order:pay', (data: PhoneChangeEventData) => {
    shoppingCartDataModel.updateData(data);
    const orderBodyData: OrderBodyData = convertToOrderBodyData(shoppingCartDataModel.getShoppingCart());
    orderData(orderBodyData).then((data:ProductOrderResult) => {
        const totalSum = data.total || 0;
        modalComponent.render({
            contentElement: orderStatusComponent.render({totalSum}),
            openFlag: true
        })
        shoppingCartDataModel.updateData({
            chosenProductsNumber: 0,
            chosenProducts: []
        });
    }).catch((err: string) => {
        phoneAndEmailForm.render({
            errorText: err
        })
    });
});

events.on('close: successOrder', () => {
    modalComponent.render({
        openFlag: false
    });
})