import 'source-map-support/register';

import Order from '@dbModel/tables/order';
import getOrder from './function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';
//import dbContext from '@dbModel/dbContext';
//import { table } from '@aws/dynamodb-data-mapper-annotations';

/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is 'void' -> we have no body!
*/
const getOrderHandler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
    let response: Response<Order>;
    try {
        const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.AccessToken);
        const userId: string = await user.isVendor(process.env.USER_POOL_ID) ? null : await user.getUserId();
        response = Response.fromData<Order>(
            await getOrder(event.pathParameters?.id, userId),
            StatusCodes.OK);
    }
    catch (error) {
        response = Response.fromError<Order>(error);
    }
    return response.toAPIGatewayProxyResult();
};

export const main = middyfy(getOrderHandler);
