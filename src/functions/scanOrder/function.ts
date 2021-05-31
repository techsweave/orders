import dbContext from '@dbModel/dbContext';
import Order from '@dbModel/tables/order';
import { ScanOptions } from '@aws/dynamodb-data-mapper';
import { objectToConditionExpression } from 'utilities-techsweave';


const scanOrder = async (filter: any, userId?: string): Promise<{
    items: Order[],
    lastKey: Partial<Order>
}> => {
    let items: Order[] = [];
    let lastKey: Partial<Order>;
    let conditionFilter = await objectToConditionExpression(filter.filter);
    if (userId) {
        conditionFilter = {
            type: 'And',
            conditions: [{
                type: 'Equals',
                subject: 'userId',
                object: userId
            },
                conditionFilter
            ]
        }
    }
    const dbFilter: ScanOptions = {
        limit: filter.limit,
        indexName: filter.indexName,
        pageSize: filter.pageSize,
        startKey: filter.startKey,
        filter: conditionFilter
    };

    const paginator = dbContext.scan(Order, dbFilter).pages();

    for await (const page of paginator) {
        items = items.concat(page);
        lastKey = paginator.lastEvaluatedKey;
    }

    return Promise.resolve({
        items: items,
        lastKey: lastKey
    });
};

export default scanOrder;
