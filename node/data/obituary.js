import Mongoose from 'mongoose';
import {useVirtualId} from '../db/db.js';

const obituary = new Mongoose.Schema( {
  imgName: {type: String},
  resident: {type: Object, required: true}, // 대표 상주
  deceased: {type: Object, required: true}, // 고인 정보
  place: {type: String, required: true},  // 장례식장
  placenumber: {type: String, required: true},
  eod: {type: String, required: true}, // 임종
  eodtime: {type: String, required: true},
  coffin: {type: String, required: true}, // 입관
  coffintime: {type: String, required: true},
  dofp: {type: String, required: true}, // 발인
  dofptime : {type: String, required: true},
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
  placenumber,     
  eod,  
  eodtime,
  coffin,
  coffintime,
  dofp,
  dofptime, 
  buried, 
  word,  ) {
  return Obituary.findByIdAndUpdate(id, {
    resident, 
    deceased,
    place,
    placenumber,     
    eod,  
    eodtime,
    coffin,
    coffintime,
    dofp,
    dofptime, 
    buried, 
    word,  }, {returnOriginal: false});
}

export async function remove(id) {
  return Obituary.findByIdAndDelete(id);
}