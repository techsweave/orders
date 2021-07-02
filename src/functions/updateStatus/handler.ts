import 'source-map-support/register';
import Order from '@dbModel/tables/order';
import updateStatus from './function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';
import schema from '@functions/updateStatus/schema';



const updateStatusHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let res: Response<Order>;
    try {

        const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.accessToken);

        if (await user.isVendor(process.env.USER_POOL_ID)) {
            throw {
                name: 'UserNotAllowed',
                message: 'You must be a User to delete a order'
            };
        }

        res = Response.fromData<Order>(
            await updateStatus(event.pathParameters.id, event.body.status, await user.getUserId()),
            StatusCodes.OK);

    } catch (error) {
        res = Response.fromError<Order>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(updateStatusHandler);