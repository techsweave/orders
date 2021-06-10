import { handlerPath } from 'utilities-techsweave';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            sqs: 'https://sqs.eu-central-1.amazonaws.com/780844780884/createOrder'
        }
    ]
};

