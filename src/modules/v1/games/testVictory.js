let arr = []
export default async (b)=> {

    let tRows =testRows(b);
    if(tRows) return tRows;

    let tCols =testCols(b);
    if(tCols) return tCols;

    let tDiagonals =testDiagonals(b);
    if(tDiagonals) return tDiagonals;

    return false
}

const testArr=(arr)=>{
    if(!arr[0]) return false;
    if (arr[0] === arr[1] && arr[1] === arr[2] ) return arr;
    return false
};

const testDiagonals=(b)=>{
    arr = [b[0][0],b[1][1],b[2][2]]
    if (testArr(arr)) return [[0,0],[1,1],[2,2]];

    arr = [b[2][0],b[1][1],b[0][2]]
    if (testArr(arr)) return [[2,0],[1,1],[0,2]];

    return false
};
const testCols=(b)=>{
    for(let i =0; i<b.length; i++) {
        arr = [b[0][i],b[1][i], b[2][i]]
        if (testArr(arr)) return [[0,i],[1,i],[2,i]];
    }
    return false
};
const testRows=(b)=>{
    for(let i =0; i<b.length; i++){
        arr = [b[i][0], b[i][1], b[i][2]]
        let res = testArr(arr)
        if (res) {
            return [[i, 0], [i, 1], [i, 2]];
        }
    }
    return false
};
