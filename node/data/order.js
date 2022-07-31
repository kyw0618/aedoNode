import Mongoose from 'mongoose';
import {useVirtualId} from '../db/db.js';

const orders = new Mongoose.Schema( {
  place: {type: Object, required: true},
  item: {type: String, required: true},
  price: {type: String, required: true},
  receiver: {type: Object, required: true},
  sender: {type: Object, required: true},
  word: {type: Object, required: true},
  created: {type: String, required: true},
  userId: {type: String, required: true}
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

