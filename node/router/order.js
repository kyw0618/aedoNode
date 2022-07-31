import express from "express";
import * as orderController from '../controller/order.js';
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.get('/', isAuth, orderController.searchOrder);
router.post('/', isAuth, orderController.createOrder);
router.get('/my', isAuth, orderController.getMyOrder);

export default router;