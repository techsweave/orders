import { main as createOrdertHandler } from '../../src/functions/createOrder/handler';
import { expect } from 'chai';
import { fakeContext, IFakeEvent, TestUser } from 'utilities-techsweave';
import * as AWS from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import deleteOrder from '../../src/functions/deleteOrder/function';
import { StatusCodes } from 'http-status-codes';

describe('handler: createOrder', async () => {
    it('Customer creation', async () => {
        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(false, process.env.USER_POOL_ID);
        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            body: {
                status: 'in progress',
                products: [{ productId: '0', quantity: 1, price: 100 }]
            }
        };
        const response: APIGatewayProxyResult = await createOrdertHandler(e, fakeContext);
        expect(response).to.be.not.null;
        expect(response.statusCode).to.be.equal(StatusCodes.CREATED);

        const body = JSON.parse(response.body);
        // console.log(body);
        await deleteOrder(body.data.id, 'testcustomer');

    });

    it('Vendor creation', async () => {
        AWS.config.update({ region: process.env.REGION });
        const test = await TestUser.fromRole(true, process.env.USER_POOL_ID);
        const e: IFakeEvent = {
            headers: {
                AccessToken: await test.getAccessToken()
            },
            body: {
                status: 'in progress',
                products: [{ productId: '0', quantity: 1, price: 100 }]
            }
        };
        const response: APIGatewayProxyResult = await createOrdertHandler(e, fakeContext);
        expect(response, 'response').to.be.not.null;
        expect(response.statusCode, 'statusCode').to.be.equal(StatusCodes.FORBIDDEN);

        const body = JSON.parse(response.body);
        expect(body.error.name, 'body.error.name').to.be.equal('UserNotAllowed');

    });
});