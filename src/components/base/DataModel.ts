import { Model } from "./Model";
import { PaymentType, ProductData, ProductDataEvent, ShoppingCartProductsList } from "../../types";
import { IEvents } from "./events";

export class ProductListModel extends Model<ProductData>{
    protected productData: ProductData;

    constructor(data: ProductData, events: IEvents){
        super(data, events);
        console.log("consturctor ProductListModel: " + JSON.stringify(this));
    }
    
    public setProductData(data: ProductData){
        this.productData = data;
        const eventData: ProductData = this.productData;
        this.emitChanges('productData:change', eventData);
    }
}

export class ShoppingCartProductListModel extends Model<ShoppingCartProductsList> {
    protected paymentType?: PaymentType;
    protected userEmail?: string;
    protected userPhone?: string | number;
    protected deliveryAddress?: string;
    protected chosenProductsNumber: number;
    protected chosenProducts?: string[];
    protected totalSum?: number

    constructor(data: ShoppingCartProductsList, events: IEvents){
        super(data, events);
    }

    updateData(data: Partial<ShoppingCartProductsList>){
        Object.assign(this, data);
    }

    getShoppingCart():ShoppingCartProductsList {
        return {
            paymentType: this.paymentType,
            userEmail: this.userEmail,
            userPhone: this.userPhone,
            deliveryAddress: this.deliveryAddress,
            chosenProductsNumber: this.chosenProductsNumber,
            chosenProducts: this.chosenProducts,
            totalSum: this.totalSum
        }
    }
}