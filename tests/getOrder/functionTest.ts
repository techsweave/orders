import { expect } from 'chai';
import getOrder from '../../src/functions/getOrder/function';
import Order from '../../src/models/database/tables/order';

describe('function: getOrder', async () => {
    it('Not working get', async () => {
        try {
            expect(await getOrder('test05', 'testcustomer')).to.be.undefined;
        } catch (error) {
            expect(error.name).equal('ItemNotFoundException');
        }
    });
    it('Wrong user', async () => {
        try {
            expect(await getOrder('test01', 'test')).to.be.undefined;
        } catch (error) {
            expect(error.name).equal('UserNotAllowed');
        }
    });


    it('Working get', async () => {
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

        expect(await getOrder('test01', 'testcustomer')).deep.contain(order);
    });
});