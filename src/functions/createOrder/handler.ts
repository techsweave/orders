import 'source-map-support/register';

import Order from '@dbModel/tables/order';
import createOrder from './function';
import { middyfy, AuthenticatedUser } from 'utilities-techsweave';
import { SQSHandler, SQSEvent } from 'aws-lambda';

/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Order'
*/
const createOrderHandler: SQSHandler = async (event: SQSEvent) => {
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

        await createOrder(order, record.accessToken?.stringValue);

    } catch (error) {
        // To CloudWath!!
        console.log('ERROR');
        console.log(error);
    }
};

export const main = middyfy(createOrderHandler);
