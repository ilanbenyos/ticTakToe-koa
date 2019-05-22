import mongoose from 'mongoose'

const User = new mongoose.Schema({
  objType: { type: String, default: 'userObj' },
  name: { type: String },
  myGroups: {type: Array, default: []},

});

User.methods.generateToken = function generateToken () {
    const user = this
    return user.id + user.id
}
export default mongoose.model('user', User)
