import {getUserByToken} from '../../middleware/validators'
import User from '../../models/users'
const userFunctions = {
  async userConnected (socket) {
    let socketId = socket.id
    try {
        let user = await getUserByToken(socket.handshake.query.token)
        user.socketId = socketId;
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

}

export default userFunctions
