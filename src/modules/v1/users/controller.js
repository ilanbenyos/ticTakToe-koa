import User from '../../../models/users'

export async function createUser (ctx) {
  let obj = ctx.request.body
  const user = new User(obj)
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
