import 'source-map-support/register';

import Order from '@dbModel/tables/order';
import createOrder from './function';
import { middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';
import { SQSHandler, SQSEvent } from 'aws-lambda';

/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Order'
*/
const createOrderHandler: SQSHandler = async (event: SQSEvent) => {
    let res: Response<Order>;

    try {
        const record = event.Records[0].messageAttributes;
        const user: AuthenticatedUser = await AuthenticatedUser.fromToken(record.accessToken?.stringValue);

        if (await user.isVendor(process.env.USER_POOL_ID)) {
            throw {
                name: 'UserNotAllowed',
                message: 'You must be a User to delete a order'
            };
        }

        const order: Order = new Order();
        order.userId = await user.getUserId();
        order.status = 'IN PROGRESS';
        order.products = JSON.parse(record.products?.stringValue);

        res = Response.fromData<Order>(await createOrder(order, record.accessToken?.stringValue), StatusCodes.CREATED);

    } catch (error) {
        res = Response.fromError<Order>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(createOrderHandler);
