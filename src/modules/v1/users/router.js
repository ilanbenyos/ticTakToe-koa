import { ensureUser } from '../../../middleware/validators'
import * as user from './controller'


export const baseUrl = '/users'

export default [
    {
        route: '/register',
        method: 'POST',
        handlers: [
          user.register
        ]
    },
    {
        route: '/login',
        method: 'POST',
        handlers: [
            user.login
        ]
    },
    {
        route: '/getMe',
        method: 'POST',
        handlers: [
            ensureUser,
            user.getMe
        ]
    },
]
