'use strict';
var express = require('express');
var UserController = require('../controllers/user');
var multer = require('multer');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
// var multipart = require('connect-multiparty');
// var md_upload = multipart({ uploadDir: './uploads' });
api.use(express.static(__dirname + '/uploads'));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, 'image' + Date.now() + file.originalname);
    },
});
const upload = multer({ storage: storage });
api.get('/home', md_auth.ensureAuth, UserController.home);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image/:id', [md_auth.ensureAuth, upload.single('image')], UserController.uploadImage);
api.get('/get-image/:imageFile', md_auth.ensureAuth, UserController.getImageFile);
module.exports = api;
