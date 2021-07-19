import dbContext from '@dbModel/dbContext';
import { ConditionExpression } from '@aws/dynamodb-expressions';
import Order from '@dbModel/tables/order';
import * as AWS from 'aws-sdk';


const createOrder = async (item: Order, accessToken: string): Promise<Order> => {
    const filter: ConditionExpression = {
        type: 'And',
        conditions: [
            {
                type: 'Equals',
                subject: 'status',
                object: 'IN PROGRESS'
            },
            {
                type: 'Equals',
                subject: 'userId',
                object: item.userId
            }
        ]
    };

    const iterator = dbContext.scan(Order, {
        filter: filter,
        limit: 1
    });

    // Only One!
    for await (const i of iterator) {
        await dbContext.delete(i);
    }

    const messageAttributes: AWS.SNS.MessageAttributeMap = {
        accesstoken: {
            DataType: 'String',
            StringValue: accessToken
        }
    };

    const sns = new AWS.SNS();
    const params: AWS.SNS.PublishInput = {
        Message: 'createNewOrder',
        TopicArn: 'arn:aws:sns:eu-central-1:780844780884:deleteCart',
        MessageAttributes: messageAttributes
    };

    await sns.publish(params).promise();


    return dbContext.put(item);
};

export default createOrder;