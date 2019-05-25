import User from "../../../models/users";
import _ from "lodash"
import testVictory from './testVictory'

export async function gameMove (ctx, next) {
    let game = ctx.state.game;
    const user = ctx.state.user;

    if(game.nextPlayer !== user.id){
        ctx.throw(422, 'NOT_YOUR_MOVE')
    }

    const square= ctx.request.body.square;
    const playerId1 = user._id.toString()
    const player2Id = (playerId1 === game.owner._id.toString())?game.member._id:game.owner._id;
    const player2 = await User.findById(player2Id);

    const move = {player:user._id, square };
    game.moves.push(move)
    let sq = game.board[square[0]][square[1]];

    if(sq !== null){
        ctx.throw(422,'SQUARE_NOT_EMPTY')
    }
    let tempBoard = _.cloneDeep(game.board);
    tempBoard[square[0]][square[1]] = user.symbol;//====================
    game.board = tempBoard;

    game.nextPlayer = player2Id;
    const victoryArr = await testVictory(game.board);

    if(victoryArr){
        game.victoryArr = victoryArr;
        game.winner = user;
        game.status = 'ended';
    }

    try {
        await game.save();
        io.to(player2.socketId).emit('GAME_MOVE',{game});
        io.to(player.socketId).emit('GAME_MOVE',{game});
        ctx.body=ctx.body||{};
        ctx.body.game = game;
        if (next) { return next() }

    } catch (err) {
        console.log('err in create game', err)
        ctx.throw(422, err.message)
    }

}
