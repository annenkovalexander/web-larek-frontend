import './scss/styles.scss';

import { ProductListModel, ShoppingCartProductListModel } from './components/base/DataModel';
import { EventEmitter } from './components/base/events';
import { ProductData, ProductItem, ShoppingCartProductsList, PageSettings, ShoppingCartAdd } from './types';
import { LarekAPI } from './components/base/larekAPI';
import { ensureElement, log } from './utils/utils';
import { API_URL, PRODUCT_URI } from './utils/constants';
import { pageSettings, productCardSettings, modalWindowSettings, cardFullSettings, shoppingCartSettings } from './utils/constants';
import { ModalComponent, Page, ProductCard, ProductFullInfo, ShoppingCart } from './components/base/ViewModel';


const events = new EventEmitter();
const pageComponent = new Page(document.querySelector(pageSettings.wrapper), pageSettings, events);
const modalComponent = new ModalComponent(document.querySelector(modalWindowSettings.modal), modalWindowSettings, events);

const cardComponentTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const fullProductInfoTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const shoppingCartTemplate = document.querySelector('#basket') as HTMLTemplateElement;



const getTotalSum = (productIds: string[]):Promise<number | void> => {
    let totalSum = 0;
    let promisesList: Promise<ProductItem | object>[] = [];
    log("getTotalSum productIds", productIds);
    productIds.forEach((productId:string) => {
        promisesList.push(larekAPI.getProductInfo(PRODUCT_URI, productId));
    })
    
    return Promise.all(promisesList).then((data: ProductItem[]) => {
        data.forEach(item => {
            totalSum += item && item.price ? item.price : 0;
        });
        return totalSum;
    }).catch(err => log("promises", err));
}


const productListInitialState: ProductData = {
    total: 0,
    items: []
}

const shoppingCartInitialState: ShoppingCartProductsList = {
    chosenProductsNumber: 0
}

const productDataModel = new ProductListModel(productListInitialState, events);
const shoppingCartDataModel = new ShoppingCartProductListModel(shoppingCartInitialState, events);
const larekAPI = new LarekAPI(API_URL);

larekAPI.getProductList(PRODUCT_URI).then((data:ProductData)=>productDataModel.setProductData(data));


events.on('productData:change', (data: ProductData)=>{
    let cardsList: HTMLElement[] = [];
    log('productData:change data', data );
    data.items.forEach((item: ProductItem) => {
        const cardComponent = cardComponentTemplate.content.querySelector(productCardSettings.galleryItem).cloneNode(true) as HTMLElement;
        cardsList.push(new ProductCard(cardComponent, productCardSettings, events).render(item))
    });
    pageComponent.render({
        productCardsList: cardsList
    })
});

events.on('product:open', (data: ProductItem) => {
    const productInfoContent = fullProductInfoTemplate.content.querySelector(cardFullSettings.cardFull).cloneNode(true) as HTMLElement;
    const productFullInfo = new ProductFullInfo(productInfoContent, cardFullSettings, events).render(data);
    modalComponent.render({
        contentElement: productFullInfo,
        openFlag: true
    })
});

events.on('shoppingCart:add', (data: ShoppingCartAdd) => {
    const shoppingCartData = shoppingCartDataModel.getShoppingCart();
    log("shoppingCart:add shoppingCartData", shoppingCartData);
    shoppingCartData.chosenProducts = shoppingCartData.chosenProducts || [];
    if (shoppingCartData.chosenProducts.indexOf(data.productId) === -1){
        shoppingCartData.chosenProducts.push(data.productId);
        shoppingCartData.chosenProductsNumber = shoppingCartData.chosenProducts.length;
        getTotalSum(shoppingCartData.chosenProducts).then(data => {
            if (typeof data === 'number'){
                shoppingCartDataModel.updateData({
                    chosenProducts: shoppingCartData.chosenProducts,
                    chosenProductsNumber: shoppingCartData.chosenProducts.length,
                    totalSum: data
                });
                pageComponent.render({
                    productQuanity: shoppingCartData.chosenProductsNumber
                });
            }
        }).catch(err => log("Ошибка при получении итоговой суммы", err));
    }
})

events.on('shoppingCart:open', () => {
    const shoppingCart = shoppingCartTemplate.content.querySelector(shoppingCartSettings.basket).cloneNode(true) as HTMLElement;
    const shoppingCartElement = new ShoppingCart(shoppingCart, shoppingCartSettings, events).render({
        totalSum: shoppingCartDataModel.getShoppingCart().totalSum
    });

    modalComponent.render({
        contentElement: shoppingCartElement,
        openFlag: true
    })
});

events.on('product:delete', (data:Partial<ProductItem>) => {
    
})

events.on('shoppingCart:order', () => {
    log('shoppingCart:order', {});
})


larekAPI.getProductInfo(PRODUCT_URI, '6a834fb8-350a-440c-ab55-d0e9b959b6e3').then((data:ProductItem) => log("productInfo",data));

getTotalSum(['6a834fb8-350a-440c-ab55-d0e9b959b6e3', 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9']).then(data => {
    if (typeof data === 'number')
        log('totalSum', data);
})

const addressData:Partial<ShoppingCartProductsList> = {
    deliveryAddress: "Москва",
    userPhone: "495"
}

shoppingCartDataModel.updateData(addressData);

log("shoppingCartDataModel update", shoppingCartDataModel.getShoppingCart());