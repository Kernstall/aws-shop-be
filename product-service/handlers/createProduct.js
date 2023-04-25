'use strict';
import { createResponse } from "../utils";
import { createProduct as createProductDAO } from "../dao";
import { v4 } from 'uuid';

export const createProduct = async (event, context) => {
    try{
        const { title, description, price, count } = JSON.parse(event.body);

        if(!(title && description && price && count)){
            return createResponse(400, {message: 'Product is not valid.'});
        }

        const id = v4();
        const product = {
            id,
            title,
            description,
            price,
        }

        const stock = {
            product_id: id,
            count
        }

        await createProductDAO(product, stock);

        return createResponse(200, {});
    } catch (error){
        return createResponse(500, error);
    }
};