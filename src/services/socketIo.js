import userFunctions from './socktIo/userFunctions'

global.io.use((socket, next) => {
  let token = socket.handshake.query.token
  if (token) {
    return next()
  } else {
    socket.emit('unauthorized', 'unauthorized err')
    return next(new Error('authentication error'))
  }
})

    io.on('connection', async (socket) => {
        await userFunctions.userConnected(socket)
        socket.emit('MSG', 'plplplplplplplplp')

        socket.on('authenticate', (msg) => {
            socket.emit('authenticate', msg)
        })
        socket.on('disconnect', async (reason) => {
            if (reason === 'io server disconnect') {
                socket.connect()
            }
            let userId = socket.handshake.query.userId
            await userFunctions.userDisconnected(userId)
        })
    })


