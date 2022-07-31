import express from "express";
import * as condoleController from '../controller/condole.js';
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post('/', isAuth, condoleController.createCondoleMessage);
router.get('/', isAuth, condoleController.getCondoleMessage);
router.put('/:id', isAuth, condoleController.updateCondole);
router.delete('/:id', isAuth, condoleController.removeCondel);

export default router;