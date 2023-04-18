'use strict';
import { createResponse } from "../utils";
import {getMockData} from "../mock";

export const getProducts = async (event, context) => {
    try{

        const products = await getMockData();

        return createResponse(200, products);
    } catch (error){
        return createResponse(500, error);
    }
};