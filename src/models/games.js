import mongoose from 'mongoose'

const Game = new mongoose.Schema({
    board: { type: Array, default:[[null,null,null],[null,null,null],[null,null,null]]},
    moves: {type: Array, default: []},
    victoryArr:{type:[Array,Boolean], default:false},
    member:{type:Object},
    waitingList:{type:Array},
    owner:{type:Object},
    nextPlayer:{type:String},//ownerId/memberId
    winner:{type:String},
    status:{type:String, default:'init'}//init/waitingList/playing/ended/aborted
});

export default mongoose.model('game', Game)
