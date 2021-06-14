import { handlerPath } from 'utilities-techsweave';
import schema from './schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'put',
                path: 'orders/{id}',
                cors: true,
                schema
            },
            authorizer: {
                name: 'ApiGatewayAuthorizer',
                arn: '${self:custom.cognitoArn}'
            }
        }
    ]
};
