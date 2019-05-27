import * as home from './controller'

export default [
    {
        route: '/test',
        method: 'GET',
        handlers: [
          home.index
        ]
    },
]
