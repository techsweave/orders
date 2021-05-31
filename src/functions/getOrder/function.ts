import dbContext from '@dbModel/dbContext';
import Order from '@dbModel/tables/order';

const getOrder = async (id: string, userId: string): Promise<Order> => {
    const item: Order = new Order();
    item.id = id;
    const order: Order = await dbContext.get(item);
    if (order.userId != userId) {
        throw {
            name: 'userNotAllowed',
            message: 'You must be the same User that made the order'
        };
    }
    return Promise.resolve(order);
};

export default getOrder;