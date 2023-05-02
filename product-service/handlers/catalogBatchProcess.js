'use strict';
import { createResponse } from "../utils";
import { createProduct as createProductDAO } from "../dao";
import { v4 } from 'uuid';
import { SNS } from 'aws-sdk';

export const catalogBatchProcess = async (event, context) => {
    const sns = new SNS({ region: 'us-east-1' });

    const messages = event.Records.map(record => JSON.parse(record.body)).filter(message => {
        if(!(message.title && message.description && message.price && message.count)){
            console.log('---Validation error for entry: ', message)
            return false;
        }
        return true;
    });
    console.log(messages);


    for(const message in messages) {
        const id = v4();
        const {title, description, price, count} = message;
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

        console.log('---creating ', product)

        try{await createProductDAO(product, stock);
            await sns.publish({
                Message: `Product ${title} created`,
                Subject: 'AWS Shop Subscription Service',
                TopicArn: 'arn:aws:sns:us-east-1:978687357621:aws-shop-sns-create-product-topic',
            }, (error) => {
                if (error) {
                    console.log('---', error);
                } else {
                    console.log('---published to sns:', product)
                }
            });
        } catch (error){
            console.log('---error: ', error)
        }

    }
};