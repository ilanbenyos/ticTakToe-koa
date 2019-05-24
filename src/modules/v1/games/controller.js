import Game from '../../../models/games'
import User from "../../../models/users";


export async function quitGame (ctx, next) {
    const game = ctx.state.game;
    const owner = ctx.state.user;
    const memberId = ctx.state.memberId

    game.member = await User.findById(memberId)
    game.owner.simbol = 'O';
    game.member.simbol = 'X';
    game.status = 'playing';

    await game.save()
    io.to(game.member.socketId).to(owner.socketId).emit('GAME_STARTED',game)

    if (next) { return next() }
}
export async function rejectJoinRequest (ctx, next) {
    let game = ctx.state.game;
    const owner = ctx.state.user;
    const memberId = ctx.request.body.memberId;
    const user2 = await User.findById(memberId)
    const memberSocketId = user2.socketId

    let idx = game.waitingList.findIndex(item=>item._id === memberId)
    game.waitingList.splice(idx,1)

    try {
        await game.save()
        io.to(memberSocketId).emit('JOIN_REQUEST_REJECTED')
    }catch(e){
        console.log('rejectJoinRequest',e);
    }
   ctx.body='ok'
    if (next) { return next() }
}
export async function startGame (ctx, next) {

    const game = ctx.state.game;
    const owner = ctx.state.user;
    const memberId = ctx.request.body.memberId

    if(game.status !=='waitingList'){
        ctx.throw(422, 'game is not in waitinglist status')
    }
    game.member = await User.findById(memberId)
    game.nextPlayer = (Math.random()> .5)? owner._id:game.member._id;
    game.owner.simbol = (game.nextPlayer === owner._id)? 'O': 'X';
    game.member.simbol =(game.nextPlayer === owner._id)? 'X': 'O';
    game.status = 'playing';

    await game.save()
    try{
        io.to(game.member.socketId).emit('GAME_STARTED',game)
        io.to(owner.socketId).emit('GAME_STARTED',game)
    }catch(e){
        console.log('socket err',e);
    }

    if (next) { return next() }
}
export async function joinRequest (ctx, next) {
    let game = ctx.state.game;
    if(game.status === 'init' || game.status === 'waitingList'){
        let user = ctx.state.user;
        game.status = 'waitingList';
        let idx = game.waitingList.findIndex(i=> i._id ===user._id)
          if(idx === -1){
              game.waitingList.push(user);
          } else{
              game[idx] = user;
          }
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

    let user = ctx.state.user;
    ctx.body = ctx.body || {};
    ctx.body.games = await Game.find({});

    if (next) { return next() }
}

export async function initGame (ctx, next) {
    let owner = ctx.state.user;
    let gameObj = {
        owner
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
