import { Model } from "./Model";
import { PaymentType, ProductData, ShoppingCartProductsList } from "../../types";
import { IEvents } from "./events";

import { log } from "../../utils/utils";

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
}