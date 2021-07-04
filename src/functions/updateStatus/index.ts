import { handlerPath } from 'utilities-techsweave';
import schema from './schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'put',
                path: 'orders/{id}',
                cors: {
                    origin: '*',
                    allowCredentials: true,
                    headers: [
                        '*'
                    ]
                },
                request: {
                    schemas: {
                        'application/json': schema
                    }
                },
            },
            authorizer: {
                name: 'ApiGatewayAuthorizer',
                arn: '${self:custom.cognitoArn}'
            }
        }
    ]
};
