'use strict';
import { createResponse } from "../utils";
import { S3, SQS } from 'aws-sdk';

const formAuthResponse = (principalId, effect, resource) => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
        }]
    }
})

export const decodeToken = (token) => Buffer.from(token, 'base64').toString('utf-8').split(':')

export const basicAuthorizer = async (event, context, cb) => {
    try{
        console.log('----Authorizer invoked');
        const { headers, methodArn } = event;
        console.log(event);

        if (!headers.authorization) throw new Error('Unauthorized');

        const token = headers.authorization.split(' ')[1];
        const [username, password] = decodeToken(token);
        console.log(username === process.env.TEST_USERNAME && password === 'TEST_PASSWORD');
        console.log(methodArn);

        if (username === process.env.TEST_USERNAME && password === 'TEST_PASSWORD') {
            cb(null, formAuthResponse(token, 'Allow', methodArn));
        } else cb( null, formAuthResponse(token, 'Deny', methodArn));
    } catch (error){
        console.log(error)
        cb( error);
    }
};