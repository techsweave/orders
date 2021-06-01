import 'source-map-support/register';

import Order from '@dbModel/tables/order';
import schema from './schema';
import createOrder from './function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';

/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Order'
*/
const createOrderHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let res: Response<Order>;

    try {
        const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.AccessToken);

        const order: Order = new Order();

        order.userId = await user.getUserId();
        order.status = event.body.status;
        order.products = event.body?.products;

        res = Response.fromData<Order>(await createOrder(order), StatusCodes.CREATED);

    } catch (error) {
        res = Response.fromError<Order>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(createOrderHandler);
