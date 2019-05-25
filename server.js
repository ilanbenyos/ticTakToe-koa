'use strict';

const koa = require('koa')
const app = new koa();
const server = require('http').createServer(app.callback())
global.io = require('socket.io')(server)

require('./src/services/socketIo')

const cors = require('koa2-cors')
const koaRouter = require('koa-router')

import bodyParser from 'koa-bodyparser'
const koaBody = require('koa-body')
app.use(koaBody({ multipart: true }))

const mongoose = require('mongoose')


// Using Passport for authentication
import passport from 'koa-passport'
require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())


mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise
mongoose.connect(`mongodb://ilanben:xsw23edc@ds145223.mlab.com:45223/dagon-db`)

app.use(cors({
    origin: '*',
    allowedHeaders: ['*'],
    // allowedHeaders: ['Origin', 'Content-Type', 'X-Auth-Token',],
    allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allow: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
}))
const router = new koaRouter()

const modules1 = require('./src/modules/v1')
modules1(app)



app.use(router.routes())
    .use(router.allowedMethods())

server.listen(3001, () => console.log('running on port 3001'))
