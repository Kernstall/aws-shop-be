'use strict';
import { createResponse } from "../utils";
import {getMockData} from "../mock";

export const getProductsById = async (event, context) => {
    try{
        const productId = event.pathParameters.productId;
        const products = await getMockData();
        const requestedElem = products.find(elem => elem.id === productId);
        if(requestedElem) {
            return createResponse(200, requestedElem);
        } else {
            return createResponse(404, {message: "Product not found"});
        }
    } catch (error){
        return createResponse(500, error);
    }
};