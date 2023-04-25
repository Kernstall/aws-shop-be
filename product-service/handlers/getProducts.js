'use strict';
import { createResponse } from "../utils";
import {getJoinedProductsList} from "../dao";

export const getProducts = async (event, context) => {
    try{

        const products = await getJoinedProductsList();

        return createResponse(200, products);
    } catch (error){
        return createResponse(500, error);
    }
};