'use strict';

import { Router } from 'express';
const api = Router();

import followController from '../controllers/follow';
import md_auth from '../middlewares/authenticated';

api.post('/follow', md_auth, followController.saveFollow);
api.delete('/follow/:id', md_auth, followController.deleteFollow);
api.get('/following/:id?/:page?', md_auth, followController.getFollowingUser);
api.get('/followed/:id?/:page?', md_auth, followController.getFollowedUsers);
api.get('/get-my-follows/:followed?', md_auth, followController.getMyFollows);

export default api;
