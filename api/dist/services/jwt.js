'use strict';
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'La_clave_secreta_red_social_mean_stack';
exports.createToken = function (user) {
    var payload = {
        sub: user.id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        // iat --> aqui se genera el tiempo de creación del token
        iat: moment().unix(),
        // exp --> aqui se genera el tiempo que expira el token
        exp: moment().add(30, 'days').unix,
    };
    return jwt.encode(payload, secret);
};
