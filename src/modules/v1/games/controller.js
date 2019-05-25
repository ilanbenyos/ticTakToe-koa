import Game from '../../../models/games'
import User from "../../../models/users";
import _ from "lodash"

export async function quitGame (ctx, next) {
}
export async function rejectJoinRequest (ctx, next) {
    let game = ctx.state.game;
    const memberId = ctx.request.body.memberId;
    const user2 = await User.findById(memberId)
    const memberSocketId = user2.socketId

    // let idx = game.waitingList.findIndex(item=>item._id === memberId)
    // game.waitingList.splice(idx,1)

    try {
        // await game.save()
        io.to(memberSocketId).emit('JOIN_REQUEST_REJECTED', "Join request rejected")
    }catch(e){
        console.log('rejectJoinRequest',e);
    }
   ctx.body='ok'
    if (next) { return next() }
}
export async function initGame (ctx, next) {
    const owner = ctx.state.user
    let ownerObj={
        _id:owner._id.toString(),
        userName:owner.userName,
        symbol:null,
    }
    let member={
        _id:null,
        userName:null,
        symbol:null
    }
    let gameObj = {
        owner:ownerObj,
        member
    }
    const game = new Game(gameObj)
    try {
        await game.save()
    } catch (err) {
        console.log('err in create game', err)
        ctx.throw(422, err.message)
    }
    ctx.body = ctx.body || {};
    ctx.body.game = game;
    if (next) { return next() }
}

export async function startGame (ctx, next) {

    const game = ctx.state.game;
    const owner = ctx.state.user;
    const memberId = ctx.request.body.memberId

    if(game.status !=='waiting'){
        ctx.throw(422, 'game is not in waiting status')
    }
    const member = await User.findById(memberId)
    let memberObj = {
        _id: member._id.toString(),
        userName: member.userName,
        symbol:(game.nextPlayer === owner._id)? 'X': 'O'
    }
    game.owner={...game.owner,symbol : (game.nextPlayer === owner._id)? 'O': 'X'};
    game.member={...memberObj}

    game.nextPlayer = (Math.random()> .5)? game.owner._id:game.member._id;
    game.status = 'playing';


    await game.save();
    try{
        io.to(member.socketId).emit('GAME_STARTED',game)
        io.to(owner.socketId).emit('GAME_STARTED',game)
    }catch(e){
        console.log('socket err',e);
    }
    ctx.body ='ok'
    if (next) { return next() }
}
export async function joinRequest (ctx, next) {
    let game = ctx.state.game;
    let user = ctx.state.user;

    if(game.status === 'init' || game.status === 'waiting'){
        game.status = 'waiting';
        let idx = game.waitingList.findIndex(i=> i._id ===user._id)
          if(idx === -1){
              game.waitingList.push(user);
          } else{
              game[idx] = user;
          }
        game.waitingList = _.cloneDeep(game.waitingList)
        await game.save();
        ctx.body = ctx.body || {};
        ctx.body.game =game;

        //send owner notification
        let gameOwner = game.owner;
        const owner = await User.findById(gameOwner._id)
        io.to(owner.socketId).emit('JOIN_REQUEST',game,user)
        ctx.body = ctx.body || {};
        ctx.body ='ok';
        if (next) { return next() }

    }else{
        if(game.status === 'playing'){
            ctx.throw(422, 'GAME_IS_PLAYING')
        }
        if(game.status === 'ended'){
            ctx.throw(422, 'GAME_ENDED')
        }
        if(game.status === 'aborted'){
            ctx.throw(422, 'GAME_ABORTED')
        }
    }
}
export async function getGame (ctx, next) {
    const game = ctx.state.game
    ctx.body = ctx.body || {};
    ctx.body.game =game


    if (next) { return next() }
}

export async function fetchGame (ctx, next) {
    let gameId = ctx.request.body.gameId;
    if(!gameId) ctx.throw(422, 'NO GAME_ID!!!')
    const game = await Game.findById(gameId)
    if(!game) ctx.throw(422, 'NO GAME FOUND!!!')

    ctx.state.game = game
    if (next) { return next() }
}

export async function fetchGames (ctx, next) {
    ctx.body = ctx.body || {};
    ctx.body.games = await Game.find({});

    if (next) { return next() }
}
export async function deleteGame (ctx, next) {
    let gameId = ctx.request.body.gameId;

    await Game.findByIdAndRemove(gameId)
    ctx.body = 'ok'
    if (next) { return next() }
}

