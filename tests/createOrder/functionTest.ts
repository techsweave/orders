// import chai from 'chai';
import { expect } from 'chai';
import createOrder from '../../src/functions/createOrder/function';
import deleteOrder from '../../src/functions/deleteOrder/function';
import Order from '../../src/models/database/tables/order';


describe('function: createOrder', async () => {
    it('Working creation', async () => {
        const order = new Order();
        order.id = 'test02';
        order.userId = 'testcustomer';
        order.status = 'in progress';
        order.products = [];
        order.products[0] = {
            quantity: 1,
            productId: '0',
            price: 100
        };

        const ret = await createOrder(order);
        expect(ret).deep.contain(order);

    });
    afterEach('Working deletion', async () => {
        await deleteOrder('test02', 'testcustomer');
    });
});
