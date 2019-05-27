import User from '../../../models/users'
import passport from 'koa-passport'

export async function index (ctx) {
    ctx.body ='ok I\'m here...' ;
}
