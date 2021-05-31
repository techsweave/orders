import dbContext from '@dbModel/dbContext';
import Order from '@dbModel/tables/order';
import getOrder from '../getOrder/function'

const deleteOrder = async (id: string, userId: string): Promise<Order> => {
    const item: Order = new Order();
    item.id = id;
    const order: Order = await getOrder(id, userId);

    if (order.userId != userId) {
        throw {
            name: 'userNotAllowed',
            message: 'You must be the same User that made the order'
        };
    }

    if (order.status != 'in progress') {
        throw {
            name: 'orderAlreadyCompleted',
            message: 'It is not possible to delete an order that has already been completed'
        };
    }
    return dbContext.delete(item);
};

export default deleteOrder;