import Mongoose from 'mongoose';
import {useVirtualId} from '../db/db.js';

const orders = new Mongoose.Schema( {
  place: {type: String},
  item: {type: String},
  price: {type: String},
  receiver_name: {type: String},
  receiver_number: {type: String},
  sender_name: {type: String},
  sender_number: {type: String},
  word: {type: String},
  company: {type: String},
  created: {type: String},
  order_complete:{type: String},
  merchant_uid: {type: String},
  userId: {type: String}
}, { 
  versionKey: false
});

useVirtualId(orders);

const Orders = Mongoose.model('Order', orders);

export async function findMyOrder(userId) {
  return Orders.find({userId}).sort({createdAt: -1});
}

export async function saveOrder(order) {
  return new Orders(order).save().then((data) => data);
}

export async function findAllOrder() {
  return Orders.find();
}

export async function findOrder(value) {
  return Orders.find({$or : 
    [{"receiver.name": value},
    {"receiver.phone": value},
    {"sender.name": value},
    {"sender.phone" : value}]}).sort({createdAt: -1});
}

export async function update( 
  id, 
  place,
  item,
  price,
  receiver_name,
  receiver_number,
  sender_name,
  sender_number,
  word,
  company,
  created,
  order_complete,
  merchant_uid,
  userId
  ) {
  return DataSend.findByIdAndUpdate(
    id, {
      place,
      item,
      price,
      receiver_name,
      receiver_number,
      sender_name,
      sender_number,
      word,
      company,
      created,
      order_complete,
      merchant_uid,
      userId
  }, 
    {returnOriginal: false});
}

export async function remove(id) {
  return DataSend.findByIdAndDelete(id);
}