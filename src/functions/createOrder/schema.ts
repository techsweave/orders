export default {
    type: 'object',
    properties: {
        status: { type: 'string' },
        products: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    quantity: { type: 'number' },
                    productId: { type: 'string' },
                    price: { type: 'number' }
                },
                required: ['quantity', 'productId', 'price']
            }
        }
    },
    required: ['status']
} as const;