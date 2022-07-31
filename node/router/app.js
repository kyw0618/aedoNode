import express from "express";
import * as appController from '../controller/app.js';

const router = express.Router();

router.get('/policy', appController.policyfun);
router.get('/verification', appController.callverification);
router.get('/terms', appController.signupTerms);

export default router;