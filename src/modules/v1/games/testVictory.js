

export default async (b)=> {
    let tRows =testRows(b);
    if(tRows) return tRows;

    let tCols =testCols(b);
    if(tCols) return tCols;

    let tDiagonals =testDiagonals(b);
    if(tDiagonals) return tDiagonals;

    return false
}

const testDiagonals=(b)=>{
    if (b[0][2] === b[1][1] === b[2][0]) return [[0, 2], [1, 1], [2, 0]];
    if (b[2][0] === b[1][1] === b[0][2]) return [[2, 0], [1, 1], [0, 2]];

    return false
}
const testCols=(b)=>{
    for(let i =0; i<b.length; i++) {
        if (b[0][i] === b[1][i] === b[2][i]) return [[0, 1], [1, i], [2, i]]
    }
            return false
}
const testRows=(b)=>{
    for(let i =0; i<b.length; i++){
        if(b[i][0] === b[i][1] === b[i][2]) return [[i,0] ,[i,1], [i,2]]
        return false
    }
}
