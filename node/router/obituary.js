import express from "express";
import * as obitController from '../controller/obituary.js';
import { isAuth } from "../middleware/auth.js";
import {upload} from "../middleware/obituary.js";

const router = express.Router();

router.post('/', isAuth, upload, obitController.createObituary);
router.put('/:id', isAuth, obitController.updateObit);
router.delete('/:id', isAuth, obitController.removeObit);
router.get('/', isAuth, obitController.getByname);
router.get('/my', isAuth, obitController.getMyObituary);
router.get('/image', isAuth, obitController.getImageData);
router.get('/:id', isAuth, obitController.getOneObituary);

export default router;