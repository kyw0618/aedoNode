import Mongoose from 'mongoose';
import { config } from '../config.js';


export async function connectDB() {
  return Mongoose.connect(config.db.host)
    .then(() => console.log('MongoDB Connected...'));
}

export function useVirtualId(schema) {
  // _id -> id
  // DB에선 _id로 저장되지만 가상으로 _id를 id로 바꾸어 줌
  schema.virtual('id').get(function() {
    return this._id.toString();
  });
  schema.set('toJSON', {virtuals: true});
  schema.set('toOject', {virtuals: true});
}