import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../config'


const User = new mongoose.Schema({
  objType: { type: String, default: 'userObj' },
  socketId: { type: String },
  userName: { type: String, required: true, unique: true },
  myGames: {type: Array, default: []},
    password: { type: String, required: true },
    score:{wins:Number, lose:Number, even:Number, score:Number}
});


User.pre('save', function preSave (next) {
    const user = this

    new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) { return reject(err) }
            resolve(salt)
        })
    })
        .then(salt => {
            bcrypt.hash(user.userName, salt, (err, hash) => {
                if (err) { throw new Error(err) }

                user.password = hash

                next(null)
            })
        })
        .catch(err => next(err))
});

User.methods.validatePassword = function validatePassword (password) {
    const user = this

    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) { return reject(err) }
//TODO :fix that!!! isMatch not working.
            resolve(true)
            // resolve(isMatch)
        })
    })
};

User.methods.generateToken = function generateToken () {
    const user = this
    return user.id //TODO :fix that!!!.

    // return jwt.sign({ id: user.id }, config.token)
}
export default mongoose.model('user', User)
