import dbContext from '@dbModel/dbContext';
import Order from '@dbModel/tables/order';
import getOrder from '../getOrder/function';

const updateStatus = async (id: string, status: string, userId: string): Promise<Order> => {

    status = status.toUpperCase();

    if (status != 'SUCCESS' && status != 'FAIL') {
        throw {
            name: 'NotAValidStatus',
            message: 'This is not a valid order status'
        };
    }

    const item: Order = new Order();
    item.id = id;

    const order: Order = await getOrder(id, userId);

    if (order.userId != userId) {
        throw {
            name: 'UserNotAllowed',
            message: 'You must be the same User that made the order'
        };
    }

    if (order.status != 'IN PROGRESS') {
        throw {
            name: 'OrderAlreadyCompleted',
            message: 'It is not possible to change the status of an order that has already been completed'
        };
    }

    order.status = status;

    return dbContext.update(order, { onMissing: 'skip' });
};

export default updateStatus;