import {getUserByToken} from '../../middleware/validators'
import User from '../../models/users'
const userFunctions = {
  async userConnected (socket) {
    let socketId = socket.id
    console.log('userConnected');
    try {
        let user = await getUserByToken(socket.handshake.query.token)
        user.socketId = socketId;
        io.to(socketId).emit('verify','MSG_FROM_SERVER');
        io.to(socketId).emit('MSG','MSG_FROM_SERVER');
        var clients = io.sockets.clients();
        console.log('user.socketId888888888888',user.socketId);
        await user.save()
      return true
    } catch (err) {
      console.log('000000000000000000000 userConnecte1d error');
      return false
    }

  },
  async userDisconnected (userId) {
    try {
      await User.findByIdAndUpdate(userId, {socketId: null})
      return true
    } catch (err) {
        console.log('userDisconnected error');
      return false
    }
  }
};

export default userFunctions
