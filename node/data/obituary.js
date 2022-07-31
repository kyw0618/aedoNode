import Mongoose from 'mongoose';
import {useVirtualId} from '../db/db.js';

const obituary = new Mongoose.Schema( {
  imgName: {type: String},
  resident: {type: Object, required: true},
  place: {type: String, required: true},
  deceased: {type: Object, required: true},
  eod: {type: String, required: true},
  coffin: {type: String, required: true},
  dofp: {type: String, required: true},
  buried: {type: String, required: true},
  word: {type: String, required: true},
  created: {type: String, required: true},
  userId: {type: String, required: true}
}, { 
  versionKey: false
});

useVirtualId(obituary);

const Obituary = Mongoose.model('Obituary', obituary);

export async function getAllObituary() {
  return Obituary.find().sort({ createdAt: -1});
}

export async function findById(id) {
  return Obituary.findById(id);
}

export async function findMyObituary(userId) {
  return Obituary.find({userId}).sort({ createdAt: -1});
}

export async function findObituaryByname(name) {
  return Obituary.find({ $or: [{"resident.name": name},
      {"deceased.name": name}, {"place": name}]}).sort({ createdAt: -1});
}

export async function save(obit) {
  return new Obituary(obit).save()
  .then((data) => data);
}

export async function update(id, resident, place, deceased, eod, coffin, dofp, buried, word) {
  return Obituary.findByIdAndUpdate(id, {resident, place, deceased, eod, coffin, dofp, buried, word}, {returnOriginal: false});
}

export async function remove(id) {
  return Obituary.findByIdAndDelete(id);
}