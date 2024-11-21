import { ILarekAPI, ShoppingCartProductsList, ProductData, ProductItem, ProductOrderResult, OrderBodyData } from "../../types";
import { Api } from "./api";
import { log } from "../../utils/utils";

export class LarekAPI extends Api implements ILarekAPI {

    constructor(baseUrl: string, options?: object){
        super(baseUrl, options);
    }
    
    getProductList(uri: string): Promise<ProductData | object> {
        return this.get(uri);
    }

    getProductInfo(uri: string, id: string): Promise<ProductItem | object> {
        return this.get(uri+"/"+id);
    }

    orderProducts(uri:string, order: OrderBodyData): Promise<ProductOrderResult | object> {
        return this.post(uri, order, 'POST');
    }
}