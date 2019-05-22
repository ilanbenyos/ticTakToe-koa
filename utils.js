'use strict';
import axios from "axios"
import Tweets from './src/models/tweets'

const words = ['marketing', 'affiliate','influencer']

export async function deleteAll () {
    await Tweets.deleteMany({}, ()=>{})
    return 'ok'
}
export async function tweetReport () {
    let res = await fetchWordsFromMongo()
    return   res.map(i=> {
        return {id:i._id, length:i.wordsArr.length}
    })
}
export async function fetchWordsFromMongo () {
    let res = await  Tweets.find({
        '_id': { $in: words}
    }, function(err, docs){});

    return res
}
export async function fetchTweetsFromApi () {
    await deleteAll();
    let multiP = words.map(async(word)=> {
        let arr =  await axios.get(`http://api.datamuse.com/words?max=1000&ml=${word}`);
        arr=arr.data.map(i=>i.word);
        return arr
    });

    let resArr = await Promise.all(multiP);
    resArr= resArr.map((wordsArr,idx)=>{
        return {_id:words[idx],wordsArr}
    })
    try {
       return await Tweets.insertMany(resArr);
     }catch(err){
        console.error(err)
    }
}

