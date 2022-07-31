import * as orderRepository from '../data/order.js';

export async function createOrder(req, res) {
  const {place, item, price, receiver, sender, word, created} = req.body;
  const userId = req.userId;
  try {
    var order = await orderRepository.saveOrder({
      place,
      item,
      price,
      receiver,
      sender,
      word,
      created,
      userId
    })
  } catch (error) {
    return res.status(400).json({"status" : "400"});
  }
  
  res.status(201).json({"status": "201", order});
}

export async function getAllOrder(req, res) {

  const orders = await orderRepository.findAllOrder();
  res.status(200).json({"status" : "200", orders});
}

export async function getMyOrder(req, res) {
  const order = await orderRepository.findMyOrder(req.userId);
  if(!order) {
    return res.status(404).json({"status": "404"});
  }
  
  res.status(200).json({"status": "200", order});
}

export async function searchOrder(req, res) {
  if (req.admin == false) {
    return res.status(403).json({"status": "403"});
  }

  const value = req.query.value;
  const result = await ( value
    ? orderRepository.findOrder(value)
    : orderRepository.findAllOrder());

  res.status(200).json({"status": "200", result});
}