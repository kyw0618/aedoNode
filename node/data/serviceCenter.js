import Mongoose from 'mongoose';
import {useVirtualId} from '../db/db.js';

const announcement = new Mongoose.Schema( {
  title: {type: String, required: true},
  content: {type: String, required: true},
  created: {type: String, required: true}
}, { 
  versionKey: false,
});

const request = new Mongoose.Schema( {
  name: {type: String, required: true},
  title: {type: String, required: true},
  phone: {type: String, required: true},
  content: {type: String, required: true},
  created: {type: String, required: true},
  userId: {type: String, required: true}
}, { 
  versionKey: false,
});

const response = new Mongoose.Schema( {
  reqId: {type: String, required: true},
  title: {type: String, required: true},
  content: {type: String, required: true},
  created: {type: String, required: true}
}, { 
  versionKey: false,
});


useVirtualId(announcement);
useVirtualId(request);
useVirtualId(response);

const Announcement = Mongoose.model('Announcement', announcement);
const UserRequest = Mongoose.model('UserRequest', request);
const UserRes = Mongoose.model('UserResponse', response);

export async function findAll() {
  return Announcement.find().sort({ createdAt: -1});
}

export async function finById(id) {
  return Announcement.findById(id);
}

export async function saveAnnouncement(announce) {
  return new Announcement(announce).save()
    .then((data) => data);
}

export async function update(id, title, content) {
  return Announcement.findByIdAndUpdate(id, {title, content}, {returnOriginal: false});
}

export async function remove(id) {
  return Announcement.findByIdAndDelete(id);
}

export async function findByAdmin(value) {
  return Announcement.find({ $or : [{"title": value}, {"created": value}]}).sort({createdAt : false});
}

export async function findRequestById(id) {
  return UserRequest.findById(id);
}

export async function findMyRequest(userId) {
  return UserRequest.find({"userId": userId}).sort({createdAt : false});
}

export async function finRequestByName(name) {
  return UserRequest.find({name});
}

export async function saveRequest(userRequest) {
  return new UserRequest(userRequest).save()
    .then((data) => data);
}

export async function updateRequest(id, title, content) {
  return UserRequest.findByIdAndUpdate(id, {title, content}, {returnOriginal: false})
    .then((data) => data);
}

export async function removeRequset(id) {
  return UserRequest.findByIdAndDelete(id);
}

export async function saveResponse(UserResponse) {
  return new UserRes(UserResponse).save().then((data) => data);
}

export async function findResponseById(id) {
  return UserRes.findById(id);
}

export async function updateResponse(id, title, content) {
  return UserRes.findByIdAndUpdate(id, {title, content}, {returnOriginal: false})
    .then((data) => data);
}

export async function removeResponse(id) {
  return UserRes.findByIdAndDelete(id);
}