'use strict';

import { Router } from 'express';
import MessageController from '../controllers/message';
const api = Router();
import md_auth from '../middlewares/authenticated';

api.post('/message', md_auth, MessageController.saveMessage);
api.get('/my-messages/:page?', md_auth, MessageController.getReceiveMessages);
api.get('/messages/:page?', md_auth, MessageController.getEmmittedMessages);
api.get('/unviewed-messages', md_auth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', md_auth, MessageController.setViewedMessages);

export default api;
