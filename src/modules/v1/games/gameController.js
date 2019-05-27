import User from "../../../models/users";
import _ from "lodash"
import testVictory from './testVictory'

export async function gameMove (ctx, next) {
    let game = ctx.state.game;
    const user = ctx.state.user;

    if(game.nextPlayer !== user.id){
        ctx.throw(422, 'NOT_YOUR_MOVE')
    }

    // =============ASIGN USERS==========
    let player;
    let player2;
    let tempPlayer;

    if(user._id.toString() ===game.owner._id){
        player = game.owner
        player.socketId = user.socketId

        let player11 = game.owner
        player2 = game.member
        tempPlayer = await User.findById(player2._id);
        player2.socketId = tempPlayer.socketId

    }else{
        player = game.member
        player.socketId = user.socketId

        player2 = game.owner
        tempPlayer = await User.findById(player2._id);
        player2.socketId = tempPlayer.socketId
    }

    // =============RUN MOVE==========
    const square= ctx.request.body.square;

    let sq = game.board[square[0]][square[1]];

    if(sq !== null){
        ctx.throw(422,'SQUARE_NOT_EMPTY')
    }
    const move = {player:user._id, square, symbol:player.symbol };
    game.moves.push(move)
    let tempBoard = _.cloneDeep(game.board);
    tempBoard[square[0]][square[1]] = player.symbol;
    game.board = tempBoard;
    game.nextPlayer = player2._id;


    // =============TEST FOR VICTORY==========
    const victoryArr = await testVictory(game.board);

    if(victoryArr){
        game.victoryArr = victoryArr;
        game.winner = user._id;
        game.status = 'ended';
    }
    // =============TEST FOR FULL BOARD==========
    if(game.moves.length === 9 && !game.winner){
        game.winner = 'EVEN';
        game.status = 'ended';
    }

    // =============SAVE && NOTIFY USERS==========
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
export async function testV (ctx, next) {
    // let arr1 = [[1,1,1],[null,null,null],[null,null,null]]
    // let arr2 = [[1,null,null],[1,null,null],[1,null,null]]
    // let arr3 = [[1,null,null],[null,1,null],[null,null,1]]
    // let arr4 = [[null,null,1],[null,1,null],[1,null,null]]
    let arr5 = [[null,null,null],[null,null,null],[2,2,2]]

    // let res1 = await testVictory(arr1)
    // console.log('111' ,arr1 ,'=======', res1);
    //
    // let res2 = await testVictory(arr2)
    // console.log('222',arr2 ,'=======', res2);
    //
    // let res3 = await testVictory(arr3)
    // console.log('333',arr3 ,'=======', res3);
    //
    // let res4 = await testVictory(arr4)
    // console.log('444', arr4 ,'=======', res4);

    let res5 = await testVictory(arr5)
    console.log('555', arr5 ,'=======', res5);


    ctx.body='ok'
}
