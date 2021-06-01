import dbContext from '@dbModel/dbContext';
import Order from '@dbModel/tables/order';


const createOrder = async (item: Order): Promise<Order> => {
    return dbContext.put(item);
};

export default createOrder;