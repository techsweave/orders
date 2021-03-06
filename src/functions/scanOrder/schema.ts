export default {
    type: 'object',
    properties: {
        filter: {
            type: 'object',
            properties: {
                type: { type: 'string' },
                object: { type: ['number', 'string', 'object'] },
                values: {
                    type: 'array',
                    items: {
                        type: ['number', 'string', 'object']
                    }
                },
                subject: { type: 'string' },
                lowerBound: { type: 'number' },
                upperBound: { type: 'number' },
                condition: { type: 'object' },
                conditions: {
                    type: 'array',
                    items: {
                        type: 'object'
                    }
                },
            },
            required: ['type']
        },
        indexName: { type: 'string' },
        limit: { type: 'number' },
        pageSize: { type: 'number' },
        startKey: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        }
    },
    required: ['limit']
} as const;