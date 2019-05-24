import { ensureUser } from '../../../middleware/validators'
import * as games from './controller'


export const baseUrl = '/games'

export default [
   {
        route: '/initGame',
        method: 'POST',
        handlers: [
            ensureUser,
            games.initGame
        ]
    },{
        route: '/fetchGames',
        method: 'POST',
        handlers: [
            ensureUser,
            games.fetchGames
        ]
    },
    {
        route: '/rejectJoinRequest',
        method: 'POST',
        handlers: [
            ensureUser,
            games.fetchGame,
            games.rejectJoinRequest
        ]
    }, {
        route: '/joinRequest',
        method: 'POST',
        handlers: [
            ensureUser,
            games.fetchGame,
            games.joinRequest,
        ]
    },{
        route: '/startGame',
        method: 'POST',
        handlers: [
            ensureUser,
            games.fetchGame,
            games.startGame,
        ]
    },{
        route: '/getGame',
        method: 'POST',
        handlers: [
            ensureUser,
            games.fetchGame,
            games.getGame,
        ]
    },{
        route: '/quitGame',
        method: 'POST',
        handlers: [
            ensureUser,
            games.fetchGame,
            games.quitGame
        ]
    },

]
