import 'source-map-support/register';
import Order from '@dbModel/tables/order';
import scanOrder from './function';

import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import StatusCodes from 'http-status-codes';

import schema from './schema';


/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Order'
*/
const scanOrderHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let res: Response<Order> = new Response<Order>();

    try {
        const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.accessToken);
        const userId: string = await user.isVendor(process.env.USER_POOL_ID) ? null : await user.getUserId();

        const result = await scanOrder(event.body, userId);
        res = Response.fromMultipleData(result.items, StatusCodes.OK, result.lastKey);

    } catch (error) {
        res = Response.fromError<Order>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(scanOrderHandler);