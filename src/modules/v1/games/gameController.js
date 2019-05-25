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

    let gamePlayerObj = (user._id.toString() ===game.owner._id.toString())?game.owner:game.member;
    const player2Id = (gamePlayerObj._id === game.owner._id.toString())?game.member._id:game.owner._id;


    const player1 = await User.findById(gamePlayerObj._id);
    const player2 = await User.findById(player2Id);

    let sq = game.board[square[0]][square[1]];

    if(sq !== null){
        ctx.throw(422,'SQUARE_NOT_EMPTY')
    }
    const move = {player:user._id, square, symbol:gamePlayerObj.symbol };
    game.moves.push(move)
    let tempBoard = _.cloneDeep(game.board);
    tempBoard[square[0]][square[1]] = gamePlayerObj.symbol;//====================
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
        io.to(player1.socketId).emit('GAME_MOVE',{game});
        ctx.body=ctx.body||{};
        ctx.body.game = game;
        if (next) { return next() }

    } catch (err) {
        console.log('err in create game', err)
        ctx.throw(422, err.message)
    }

}
