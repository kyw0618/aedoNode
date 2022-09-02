import * as orderRepository from '../data/order.js';

export async function createOrder(req, res) {
  const {
    place, // 장례식장
    item,   // 화환명
    price,  // 화환 가격     
    receiver_name, // 받는 사람
    receiver_number, // 받는 사람 전화번호
    sender_name, // 보내는 사람
    sender_number,  // 보내는 사람 전화번호
    word, // 화환 리본 문구
    company, // 회사명 또는 모임명
    created, // 주문 생성일자
    order_complete, // 주문 완료 코드
    merchant_uid  // 주문 번호
  } = req.body;
  const userId = req.userId;
  try {
    var order = await orderRepository.saveOrder({
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
    });
  } catch (error) {
    return res.status(400).json({"status" : "400"});
  }
  
  res.status(201).json({"status": "201", order});
}

export async function updateDocument(req, res, next) {
  const id = req.query.id;
  const {
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
   } = req.body;

  const obit = await orderRepository.findById(id);
  if(!obit) {
    return res.status(404).json({"status":"404"});
  }
  if(obit.userId !== req.userId && config.adminId !== req.userId) {
    return res.status(403).json({"status": "403"});
  }

  const updatedObit = await orderRepository.update(
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
    );  
  res.status(200).json({"status": "200", updatedObit});
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
    : orderRepository.getAllObituary());

  res.status(200).json({"status": "200", result});
}