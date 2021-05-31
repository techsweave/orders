import 'source-map-support/register';

import Order from '@dbModel/tables/order';
import deleteOrder from './function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';

import { StatusCodes } from 'http-status-codes';
/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Order'
*/
const deleteOrderHandler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
    let res: Response<Order>;
    try {

        const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.AccessToken);

        res = Response.fromData<Order>(
            await deleteOrder(event.pathParameters.id),
            StatusCodes.OK);

    } catch (error) {
        res = Response.fromError<Order>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(deleteOrderHandler);