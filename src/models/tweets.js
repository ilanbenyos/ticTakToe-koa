import mongoose from 'mongoose'

const Tweet = new mongoose.Schema({
  _id: { type: String },
  wordsArr: {type: Array, default: []},
});
export default mongoose.model('tweet', Tweet)
