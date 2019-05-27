import * as home from './controller'

export default [
    {
        route: '/',
        method: 'GET',
        handlers: [
          home.index
        ]
    },
]
