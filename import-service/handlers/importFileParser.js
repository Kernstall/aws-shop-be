'use strict';
import { createResponse } from "../utils";
import { S3 } from 'aws-sdk';
const csv = require("csv-parser");
const CSV_BUCKET_NAME = 'aws-shop-csv-storage';

const params = { region: 'us-east-1' };
const s3 = new S3(params);

const getObject = async (key) => {
    const arr = [];
    const object = await s3.getObject({Key: key, Bucket: CSV_BUCKET_NAME});
    const readStream = object.createReadStream();
    console.log(`---Csv parsing started `, key);
    return await new Promise((resolve, reject) => {
        readStream.pipe(csv())
            .on("data", function (data) {
                console.log('---Parsed csv entry: ', data);
                arr.push(data);
            })
            .on("end", function () {
                console.log(`---Csv parsing ended`);
                resolve(arr);
            })
            .on("error", function (error) {
                console.log('---Error parsing csv: ', error.message);
                reject(error.message);
            });
    });
}

const copyObject = async (key) => s3.copyObject({
    Bucket: CSV_BUCKET_NAME,
    CopySource: `${CSV_BUCKET_NAME}/${key}`,
    Key: key.replace('uploaded/', 'parsed/'),
})
    .promise();

const deleteObject = async (key) => s3.deleteObject({
    Bucket: CSV_BUCKET_NAME,
    Key: key,
})
    .promise();

export const importFileParser = async (event, context) => {
    try{
        const key = event.Records[0].s3.object.key;

        const file = await getObject(key);
        await copyObject(key);
        await deleteObject(key);

        return createResponse(200);
    } catch (error){
        return createResponse(500, error);
    }
};