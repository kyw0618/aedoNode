import express from "express";
import * as authController from '../controller/auth.js';
import { body, param, validationResult, query } from 'express-validator';
import { isAuth } from "../middleware/auth.js";
import { validate } from '../middleware/validator.js'

const router = express.Router();

const validateSms= [
  body('phone').trim().notEmpty(),
  validate,
];

const validateCredential = [
  body('phone').trim().notEmpty(),
  body('smsnumber').trim().notEmpty(),
  validate,
];

const validateSignup = [
  ... validateCredential,
  body('birth').trim().notEmpty(),
  body('name').trim().notEmpty(),
  validate,
];

router.post('/', validateSignup, authController.singup);
router.put('/', validateCredential, authController.login);
router.put('/auto', authController.autoLogin);
router.get('/', isAuth, authController.getUserInfo);
router.get('/terms', authController.getAuthTerms);
router.get('/admin', isAuth, authController.adminGetUser);
router.delete('/', isAuth, authController.logout);
router.post('/sms', validateSms, authController.sendsms);
export default router;