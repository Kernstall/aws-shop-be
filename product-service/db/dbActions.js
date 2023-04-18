const awsSDK = require('aws-sdk');
const {log} = require("webpack-node-externals/utils");

require('dotenv').config();

awsSDK.config.credentials = new awsSDK.SharedIniFileCredentials({
    profile: "sandx",
});

const dynamo = new awsSDK.DynamoDB({ region: process.env.AWS_REGION });


const products = [
    {
        description: "Short Product Description1",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        price: 24,
        title: "ProductOne",
    },
    {
        description: "Short Product Description7",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
        price: 15,
        title: "ProductTitle",
    },
    {
        description: "Short Product Description2",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
        price: 23,
        title: "Product",
    },
    {
        description: "Short Product Description4",
        id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
        price: 15,
        title: "ProductTest",
    },
    {
        description: "Short Product Descriptio1",
        id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
        price: 23,
        title: "Product2",
    },
    {
        description: "Short Product Description7",
        id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
        price: 15,
        title: "ProductName",
    },
];

const stock = [{
        product_id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        count: 5,
    },
    {
        product_id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
        count: 3,
    },
    {
        product_id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
        count: 10,
    },
    {
        product_id: '7567ec4b-b10c-48c5-9345-fc73348a80a1',
        count: 7,
    },]

const productsMap = products.map(({ id, title, price, description }) => ({
    TableName: 'products',
    Item: {
        id: { S: id },
        title: { S: title },
        price: { N: price.toString() },
        description: { S: description },
    },
}));

const stocksMap = stock.map(({ product_id, count }) => ({
    TableName: 'stocks',
    Item: {
        'product_id': { S: product_id },
        count: { N: count.toString() },
    },
}));

productsMap.forEach((item) =>
    dynamo.putItem(item, (error) => { error && console.log(error);
    })
);

/*
dynamo
    .scan({
        TableName: 'products'
    }, (err, data)=> console.log(data))
*/

stocksMap.forEach((item) =>
    dynamo.putItem(item, (error) => { error && console.log(error);
    })
);
