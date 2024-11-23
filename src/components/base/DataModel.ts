import { Model } from "./Model";
import { OrderBodyData, PaymentType, ProductData, ShoppingCartProductsList } from "../../types";
import { IEvents } from "./events";

import { log } from "../../utils/utils";

export const appState = {
    activeId: ""
}

export function convertToOrderBodyData(data:ShoppingCartProductsList): OrderBodyData{
    return {
        payment: PaymentType[data.paymentType],
        email: data.userEmail,
        phone: data.userPhone,
        address: data.deliveryAddress,
        total: data.totalSum,
        items: data.chosenProducts
    }
}

export class ProductListModel extends Model<ProductData>{
    protected _productData: ProductData;

    constructor(data: ProductData, events: IEvents){
        super(data, events);
    }

    set productData(data: ProductData){
        this._productData = data;
        const eventData: ProductData = this._productData;
        this.emitChanges('productData:change', eventData);
    }
    
    updateData(data: ProductData){
        Object.assign(this, {productData: data});
    }

    getProductList(){
        return this._productData.items;
    }
}

export class ShoppingCartProductListModel extends Model<ShoppingCartProductsList> {
    protected _paymentType: PaymentType;
    protected _userEmail: string;
    protected _userPhone: string | number;
    protected _deliveryAddress: string;
    protected _chosenProductsNumber: number;
    protected _chosenProducts: string[];
    protected _totalSum: number

    constructor(data: ShoppingCartProductsList, events: IEvents){
        super(data, events);
    }

    updateData(data: Partial<ShoppingCartProductsList>){
        Object.assign(this, data);
    }

    set paymentType(value: PaymentType){
        this._paymentType = value;
    }

    set userEmail(value: string){
        this._userEmail = value;
    }
    set userPhone(value: string | number){
        this._userPhone = value;
    }
    set deliveryAddress(value: string){
        this._deliveryAddress = value;
    }
    set chosenProductsNumber(value: number){
        this._chosenProductsNumber = value;
    }
    set chosenProducts(value: string[]){
        this._chosenProducts = value;
        this._chosenProductsNumber = this._chosenProducts.length;
        this.events.emit('chosenProducts:change', {chosenProducts: this._chosenProducts, chosenProductsNumber: this._chosenProductsNumber})
    }
    set totalSum(value: number){
        this._totalSum = value;
    }

    
    getShoppingCart():ShoppingCartProductsList {
        return {
            paymentType: this._paymentType,
            userEmail: this._userEmail,
            userPhone: this._userPhone,
            deliveryAddress: this._deliveryAddress,
            chosenProductsNumber: this._chosenProductsNumber,
            chosenProducts: this._chosenProducts,
            totalSum: this._totalSum
        }
    }

    getButtonStatus(id: string) {
        return this._chosenProducts.indexOf(id) === -1;
    }

    addNewProduct(id: string){
        if (!Array.isArray(this._chosenProducts))
            this._chosenProducts = [];
        if (this._chosenProducts.indexOf(id) === -1){
            this._chosenProducts.push(id);
        }
        this._chosenProductsNumber = this._chosenProducts.length;
        this.events.emit('chosenProducts:change', {chosenProducts: this._chosenProducts, chosenProductsNumber: this._chosenProductsNumber});
    }

    deleteProduct(id: string){
        this._chosenProducts = this._chosenProducts.filter((productId:string) => productId !== id);
        this._chosenProductsNumber = this._chosenProducts.length;
        this.events.emit('chosenProducts:change', {chosenProducts: this._chosenProducts, chosenProductsNumber: this._chosenProductsNumber});
    }
}