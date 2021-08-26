'use strict';

// Este middleware verifica si el token de la cabecera es valido y no ha espirado antes de
// dar acceso al usuario que hace la petición de login.

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'La_clave_secreta_red_social_mean_stack';

exports.ensureAuth = function (req: any, res: any, next: any) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: 'La petición no tiene la cabecera de autorización' });
  }

  var token = req.headers.authorization.replace(/[' "]+/g, '');

  try {
    var payload = jwt.decode(token, secret);

    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: 'EL token expiró' });
    }
  } catch (ex) {
    return res.status(404).send({ message: 'El token no es valido' });
  }
  // Adjuntar el payload a la req, para tener siempre dentro de los controladores el objeto del usuario logueado
  req.user = payload;

  next();
};
