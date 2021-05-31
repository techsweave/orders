import dbContext from '@dbModel/dbContext';
import Order from '@dbModel/tables/order';

const getOrder = async (id: string): Promise<Order> => {
    const item: Order = new Order();
    item.id = id;
    return dbContext.get(item);
};

export default getOrder;