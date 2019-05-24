import Game from '../../../models/games'
import User from "../../../models/users";
import testVictory from './testVictory'

export async function gameMove (ctx, next) {
    let game = ctx.state.game;
    const player = ctx.state.user;
    const square= ctx.request.body.square;

    const nextTurnPlayer = game.moves[game.moves.length]._id
    if(nextTurnPlayer !== player._id){
        ctx.throw(422, 'NOT_YOUR_MOVE')
    }
    const move = {player:player._id, square }
    game.moves.push(move)
    game.board.square[0].square[1] = player.symbol
    game.nextPlayer = player._id
    const victoryArr = testVictory(game.board)

    if(victoryArr){
        game.victoryArr = victoryArr;
        game.winner = player;
        game.status = 'ended';
    }

    try {
        await game.save()
        io.to(game.member.socketId).emit('GAME_MOVE',{game});
        io.to(game.owner.socketId).emit('GAME_MOVE',{game});
        ctx.body.game = game;
        if (next) { return next() }

    } catch (err) {
        console.log('err in create game', err)
        ctx.throw(422, err.message)
    }

}
