import { main as deleteOrdertHandler } from '../../src/functions/createOrder/handler';
import { expect } from 'chai';
import { fakeContext, IFakeEvent, TestUser } from 'utilities-techsweave';
import * as AWS from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import Order from '../../src/models/database/tables/order'
import createOrder from '../../src/functions/createOrder/function';
import { StatusCodes } from 'http-status-codes';

describe('handler: deleteOrder', async () => {
    const order = new Order();
    order.id = 'test01';
    order.userId = 'testcustomer';
    order.status = 'in progress';
    order.products = [];
    order.products[0] = {
        quantity: 1,
        productId: '0',
        price: 100
    };

    it('Customer working delete', async () => {
        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(false, process.env.USER_POOL_ID);
        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            pathParameters: 'test01'
        };

        const response: APIGatewayProxyResult = await deleteOrdertHandler(e, fakeContext);
        expect(response).to.be.not.null;
        await createOrder(order);

    });

    it('Vendor delete not working', async () => {
        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(true, process.env.USER_POOL_ID);
        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            pathParameters: 'test01',
        };
        const response: APIGatewayProxyResult = await deleteOrdertHandler(e, fakeContext);
        expect(response, 'response').to.be.not.null;
        expect(response.statusCode, 'response.statusCode').to.be.equal(StatusCodes.FORBIDDEN);

        const body = JSON.parse(response.body);
        expect(body.error.name, 'body.error.name').to.be.equal('UserNotAllowed');

    });

});