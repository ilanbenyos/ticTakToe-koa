import User from '../../../models/users'
import passport from 'koa-passport'

export async function testConnection (ctx) {
    let user = ctx.state.user;
    let msg = ctx.request.body.msg;

    io.to(user.socketId).emit('TEST_CONNECTION',msg)
    ctx.body ='ok';
}
export async function getMe (ctx, next) {
    let user = ctx.state.user
    user = user.toJSON()

    ctx.body = ctx.body || {}
    ctx.body.user = user

    if (next) { return next() }
}

export async function register (ctx) {
  let userName = ctx.request.body.userName;
    let password = ctx.request.body.password

    const user = new User({userName, password})
  try {
    await user.save()
  } catch (err) {
    console.log('err in createUser', err)
    ctx.throw(422, err.message)
  }

  const token = user.generateToken()
  const response = user.toJSON()
    delete response.password

  ctx.body = {
    user: response,
    token
  }
}

export async function login (ctx, next) {
    let res = passport.authenticate('local', (err, user) => {
        if (err || !user) {
            ctx.throw(403, 'LOGIN FAILED111')
        }

        const token = user.generateToken()
        const response = user.toJSON()

        delete response.password

        ctx.body = {
            token,
            user: response
        }
    })(ctx, next)
    return res
}

export async function logout (ctx, next) {
    const user = ctx.state.user;
    user.socketId = null;
    try {
        await user.save()
        ctx.body = 'ok'
        if (next) { return next() }
    } catch (err) {
        console.log('err in logout', err)
        ctx.throw(422, err.message)
    }
}
