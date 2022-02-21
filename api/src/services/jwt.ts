'use strict';

import jwt from 'jwt-simple';
import moment from 'moment';
const secret = 'La_clave_secreta_red_social_mean_stack';

function createToken(user: any) {
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
}

export default createToken;
// Este servicio me permite generar y devolver un token basados en un payload que son las propiedades
// del usuario y una clave secreta utilizando la libreria jwt(json web token) y moment para
// manejar el tiempo de creación y expiración.
