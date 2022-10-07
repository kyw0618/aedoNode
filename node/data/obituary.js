import Mongoose from 'mongoose';
import {useVirtualId} from '../db/db.js';

const obituary = new Mongoose.Schema( {
  imgName: {type: String},
  resident: {type: Object, required: true}, // 대표 상주
  deceased: {type: Object, required: true}, // 고인 정보
  place: {type: Object, required: true},  // 장례식장
  eod: {type: Object, required: true}, // 임종
  coffin: {type: Object, required: true}, // 입관
  dofp: {type: Object, required: true}, // 발인
  buried: {type: String, required: true}, // 장지
  word: {type: String, required: true}, // 상주말씀
  created: {type: String, required: true},  //부고 작성 일자
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

export async function update(id, 
  resident, 
  deceased,
  place,
  eod,  
  coffin,
  dofp,
  buried, 
  word,  ) {
  return Obituary.findByIdAndUpdate(id, {
    resident, 
    deceased,
    place,
    eod,  
    coffin,
    dofp,
    buried, 
    word,  
  }, {returnOriginal: false});
}

export async function remove(id) {
  return Obituary.findByIdAndDelete(id);
}