export default {
    type: 'object',
    properties: {
        status: { type: 'string' }
    },
    required: ['status']
} as const;