import dbContext from '@dbModel/dbContext';
import Order from '@dbModel/tables/order';
import { ScanOptions } from '@aws/dynamodb-data-mapper';
import { objectToConditionExpression } from 'utilities-techsweave';


const scanOrder = async (filter: any): Promise<{
    items: Order[],
    lastKey: Partial<Order>
}> => {
    let items: Order[] = [];
    let lastKey: Partial<Order>;
    const dbFilter: ScanOptions = {
        limit: filter.limit,
        indexName: filter.indexName,
        pageSize: filter.pageSize,
        startKey: filter.startKey,
        filter: await objectToConditionExpression(filter.filter)
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
