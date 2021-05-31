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

        if (await user.isVendor(process.env.USER_POOL_ID)) {
            throw {
                name: 'userNotAllowed',
                message: 'You must be a User to delete a order'
            };
        }

        res = Response.fromData<Order>(
            await deleteOrder(event.pathParameters.id, await user.getUserId()),
            StatusCodes.OK);
    } catch (error) {
        res = Response.fromError<Order>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(deleteOrderHandler);