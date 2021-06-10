import { expect } from 'chai';
import { after } from 'mocha';
import createOrder from '../../src/functions/createOrder/function';
import deleteOrder from '../../src/functions/deleteOrder/function';
import getOrder from '../../src/functions/getOrder/function'
import Order from '../../src/models/database/tables/order';

describe('function: deleteOrder', async () => {
    const order = new Order();
    order.id = 'test01';
    order.userId = 'testcustomer';
    order.status = 'in progress';
    order.products = [];
    order.products[0] = {
        quantity: 1,
        productId: '0',
        price: 100
    };

    const order2 = new Order();
    order2.id = 'test03';
    order2.userId = 'testcustomer';
    order2.status = 'completed';
    order2.products = [];
    order2.products[0] = {
        quantity: 1,
        productId: '0',
        price: 100
    };

    it('Not working delete for Completed Order', async () => {
        await createOrder(order2);
        try {
            expect(await deleteOrder('test03', 'testcustomer')).to.be.undefined;
        } catch (error) {
            expect(error.name).equal('OrderAlreadyCompleted');
        }
    });

    it('Not working delete for Item not Found', async () => {
        try {
            expect(await deleteOrder('Not existing', 'testcustomer')).to.be.undefined;
        } catch (error) {
            expect(error.name).equal('ItemNotFoundException');
        }
    });

    it('Not working delete for User not Allowed', async () => {
        try {
            expect(await deleteOrder('test01', 'test')).to.be.undefined;
        } catch (error) {
            expect(error.name).equal('UserNotAllowed');
        }
    });

    it('Working delete', async () => {
        try {
            expect(await deleteOrder('test01', 'testcustomer')).deep.contains(order);

        } catch (error) {
            expect(error.name).to.be.null;
        }



        try {
            expect(await getOrder('test01', 'testcustomer')).to.be.null;
        } catch (error) {
            expect(error.name).equal('ItemNotFoundException');
        }


    });

    after('Recreation item', async () => {

        await createOrder(order);

    });
});