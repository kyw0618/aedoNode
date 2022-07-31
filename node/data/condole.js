import Mongoose from 'mongoose';
import { useVirtualId } from '../db/db.js';

const condoleMessage = new Mongoose.Schema( {
  title: {type: String, required: true},
  content: {type: String, required: true},
  name: {type: String, required: true},
  created: {type: String, required: true},
  obId: {type: String, required: true},
  userId: {type: String, required: true},
}, { 
  versionKey: false
});

useVirtualId(condoleMessage);
const Condole = Mongoose.model('Condole', condoleMessage);

export async function findById(id) {
  return Condole.findById(id);
}

export async function save(condole) {
  return new Condole(condole).save();
}

export async function update(id, title, content) {
  return Condole.findByIdAndUpdate(id, {title, content}, {returnOriginal: false});
}

export async function remove(id) {
  return Condole.findByIdAndDelete(id);
}

export async function findByObId(obId) {
  return Condole.find({"obId" : obId}).sort({createdAt: -1});
}