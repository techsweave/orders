import dbContext from '@dbModel/dbContext';
import Order from '@dbModel/tables/order';

const deleteOrder = async (id: string): Promise<Order> => {
    const item: Order = new Order();
    item.id = id;
    return dbContext.delete(item);
};

export default deleteOrder;