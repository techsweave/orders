import dbContext from '@dbModel/dbContext';
import { ConditionExpression } from '@aws/dynamodb-expressions';
import Order from '@dbModel/tables/order';


const createOrder = async (item: Order): Promise<Order> => {
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

    return dbContext.put(item);
};

export default createOrder;