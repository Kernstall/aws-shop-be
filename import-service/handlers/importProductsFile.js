'use strict';
import { createResponse } from "../utils";
import { S3 } from 'aws-sdk';
const CSV_BUCKET_NAME = 'aws-shop-csv-storage';

const params = { region: 'us-east-1' };
const s3 = new S3(params);

export const importProductsFile = async (event, context) => {
    try{
        const fileName = event.queryStringParameters.name;
        if(!fileName){
            return createResponse(400, {message: 'Filename not specified'});
        }
        const params = {
            Bucket: CSV_BUCKET_NAME,
            Key: `uploaded/${fileName}`,
            ContentType: 'text/csv'
        }
        const url = s3.getSignedUrl("putObject", params);
        return createResponse(200, url);
    } catch (error){
        return createResponse(500, error);
    }
};