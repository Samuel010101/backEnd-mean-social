'use strict';
var express = require('express');
var UserController = require('../controllers/user');
var multer = require('multer');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });
// api.use(express.static(__dirname + '/uploads/users'));
// const storage = multer.diskStorage({
//   destination: function (req: any, file: any, cb: any) {
//     cb(null, './uploads/users');
//   },
//   filename: function (req: any, file: any, cb: any) {
//     cb(null, 'image' + Date.now() + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });
api.get('/home', md_auth.ensureAuth, UserController.home);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.get('/counters/:id?', md_auth.ensureAuth, UserController.getCounters);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image/:imageFile', md_auth.ensureAuth, UserController.getImageFile);
module.exports = api;
