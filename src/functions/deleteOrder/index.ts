import { handlerPath } from 'utilities-techsweave';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'delete',
                path: 'orders/{id}',
                cors: {
                    origin: '*',
                    allowCredentials: true,
                    headers: [
                        '*'
                    ]
                },
            },
            authorizer: {
                name: 'ApiGatewayAuthorizer',
                arn: '${self:custom.cognitoArn}'
            }
        }
    ]
};
