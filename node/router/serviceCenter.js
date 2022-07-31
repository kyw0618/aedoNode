import express from "express";
import * as centerController from '../controller/serviceCenter.js';
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.get('/announcement/admin', isAuth, centerController.adminSearch);
router.get('/announcement', isAuth, centerController.getAnnounceMent);
router.post('/announcement', isAuth, centerController.createAnnouncement);
router.put('/announcement/:id', isAuth, centerController.updateAnnouncement);
router.delete('/announcement/:id', isAuth, centerController.removeAnnouncement);

router.get('/request', isAuth, centerController.myRequest);
router.get('/request/:id', isAuth, centerController.getReqAndRes);
router.get('/request/admin', isAuth, centerController.getRequestByname);
router.post('/request', isAuth, centerController.createRequest);
router.put('/request/:id', isAuth, centerController.updateUserRequest);
router.delete('/request/:id', isAuth, centerController.removeUserRequest);

router.post('/response', isAuth, centerController.createResponse);
router.put('/response/:id', isAuth, centerController.updateUserResponse);
router.delete('/response/:id', isAuth, centerController.removeUserResponse);


export default router;