import mongoose from 'mongoose'

const Game = new mongoose.Schema({
    board: { type: Array, default:[[null,null,null],[null,null,null],[null,null,null]]},
    moves: {type: Array, default: []},
    victoryArr:{type:[Array,Boolean], default:false},
    waitingList:{type:Array},
    member:{type:Object},
    owner:{type:Object},
    nextPlayer:{type:String},//ownerId/memberId
    winner:{type:String},
    status:{type:String, default:'init'}//init/waiting/playing/ended/aborted
});

export default mongoose.model('game', Game)
