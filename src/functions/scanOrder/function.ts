import dbContext from '@dbModel/dbContext';
import Order from '@dbModel/tables/order';
import { ScanOptions } from '@aws/dynamodb-data-mapper';
import { ConditionExpression } from '@aws/dynamodb-expressions';
import { objectToConditionExpression } from 'utilities-techsweave';


const scanOrder = async (filter: any, userId?: string): Promise<{
    items: Order[],
    lastKey: Partial<Order>
}> => {
    let items: Order[] = [];
    let lastKey: Partial<Order>;
    let conditionFilter = await objectToConditionExpression(filter.filter);
    if (userId) {
        const equalsToUserIdFilter: ConditionExpression = {
            type: 'Equals',
            subject: 'userId',
            object: userId
        };
        if (conditionFilter)
            conditionFilter = {
                type: 'And',
                conditions: [
                    equalsToUserIdFilter,
                    conditionFilter
                ]
            };
        else
            conditionFilter = equalsToUserIdFilter;
    }
    const dbFilter: ScanOptions = {
        limit: filter.limit,
        indexName: filter?.indexName,
        pageSize: filter?.pageSize,
        startKey: filter.startKey ? {
            id: filter.startKey
        } : undefined,
        readConsistency: 'strong',
        filter: conditionFilter
    };

    const paginator = dbContext.scan(Order, dbFilter).pages();

    for await (const page of paginator) {
        items = items.concat(page);
        lastKey = paginator.lastEvaluatedKey;
    }

    items.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
    });

    return Promise.resolve({
        items: items,
        lastKey: lastKey
    });
};

export default scanOrder;
