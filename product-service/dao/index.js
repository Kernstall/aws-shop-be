import * as AWS from 'aws-sdk';

/*
const dynamo = new AWS.DynamoDB();*/
const dynamoClient = new AWS.DynamoDB.DocumentClient();

export const getProductsList = async () =>{
    return (await dynamoClient
        .scan({
            TableName: 'products'
        })
        .promise()).Items;
}

export const getStocksList = async () =>{
    return (await dynamoClient
        .scan({
            TableName: 'stocks'
        })
        .promise()).Items;
}

export const getJoinedProductsList = async () =>{
    const products = await getProductsList();
    const stocks = await getStocksList();
    return products.map((product) => ({
        ...product,
        count: stocks.find((stock) => stock.product_id === product.id)?.count,
    }))

}

export const getProductById = async (id) => {
    return (await dynamoClient
        .query({
            TableName: `products`,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: { ":id": id },
        })
        .promise()).Items[0];

}

export const getStockById = async (id) => {
    return (await dynamoClient
        .query({
            TableName: `stocks`,
            KeyConditionExpression: "product_id = :product_id",
            ExpressionAttributeValues: { ":product_id": id },
        })
        .promise()).Items[0];
};

export const getJoinedProductById = async (id) =>{
    const products = await getProductById(id);
    const stocks = await getStockById(id);
    return {...products, ...(stocks?{count: stocks.count}:{})};
}

export const createProduct = async (product, stock) => {
    return dynamoClient
        .transactWrite({
            TransactItems: [
                {
                    Put: { TableName: 'products', Item: product },
                },
                {
                    Put: { TableName: 'stocks', Item: stock },
                },
            ],
        })
        .promise();
}

