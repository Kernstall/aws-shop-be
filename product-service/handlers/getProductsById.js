'use strict';
import { createResponse } from "../utils";
import {getJoinedProductById} from "../dao";

export const getProductsById = async (event, context) => {
    try{
        const productId = event.pathParameters.productId;
        const product = await getJoinedProductById(productId);
        if(product) {
            return createResponse(200, product);
        } else {
            return createResponse(404, {message: "Product not found"});
        }
    } catch (error){
        return createResponse(500, error);
    }
};