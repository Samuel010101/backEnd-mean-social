'use strict';

var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

// METODO PARA GUARDAR EL SEGUIMIENTO A UN USUARIO
function saveFollow(req: any, res: any) {
  // Capturar los datos(parametros) que vienen en el cuerpo de la petición
  var params = req.body;

  // Crear el objeto del modelo
  // Setear el valor a cada una de las propiedades del objeto follow
  var follow = new Follow();
  // Validar que el usuario que hace la petición de seguir es el mismo que esta logueado
  follow.user = req.user.sub;
  follow.followed = params.followed;

  follow.save((err: any, followStored: any) => {
    if (err)
      return res
        .status(500)
        .send({ message: 'Error al guardar este seguimiento' });

    if (!followStored)
      return res
        .status(404)
        .send({ message: 'No se ha podido seguir al usuario' });

    return res.status(200).send({ follow: followStored });
  });
}

function deleteFollow(req: any, res: any) {
  // Recoger el id del usuario logueado
  var userId = req.user.sub;
  // Recoger el id del usuario a borrar(este viene como parametro por la URL)
  var followId = req.params.id;

  Follow.find({ user: userId, followed: followId }).remove((err: any) => {
    if (err)
      return res.status(500).send({ message: 'Error al dejar de seguir' });

    return res.status(200).send({ message: 'El follow se ha elimidano!!' });
  });
}

// METODO PARA LISTAR LOS USUARIOS QUE SIGO
function getFollowingUser(req: any, res: any) {
  // Capturar el id del usuario logueado
  var userId = req.user.sub;
  // Validar si por la URL me pasan algun id entonces usarlo como referencia sustituyento el valor de
  // userId por el id que llego como parametro
  if (req.params.id && req.params.page) {
    userId = req.params.id;
  }

  var page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  var itemsPerPage = 4;

  Follow.find({ user: userId })
    .populate({ path: 'followed' })
    .paginate(
      page,
      itemsPerPage,
      (err: string, follows: any, total: number) => {
        if (err)
          return res.status(500).send({ message: 'Error en el servidor' });

        if (!follows)
          return res
            .status(404)
            .send({ message: 'No estas siguiendo ningun usuario' });
        return res.status(200).send({
          total: total,
          pages: Math.ceil(total / itemsPerPage),
          follows,
        });
      }
    );
}

// METODO PARA LISTAR LOS USUARIOS QUE ME SIGUEN
function getFollowedUsers(req: any, res: any) {
  // Recoger los parametros de usuario identificado
  var userId = req.user.sub;
  // Validar si por la URL me pasan algun id entonces usarlo como referencia sustituyento el valor de
  // userId por el id que llego como parametro
  if (req.params.id && req.params.page) {
    userId = req.params.id;
  }

  var page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  var itemsPerPage = 4;

  Follow.find({ followed: userId })
    .populate({ path: 'user' })
    .paginate(
      page,
      itemsPerPage,
      (err: string, follows: any, total: number) => {
        if (err)
          return res.status(500).send({ message: 'Error en el servidor' });

        if (!follows)
          return res
            .status(404)
            .send({ message: 'No estas siguiendo ningun usuario' });
        return res.status(200).send({
          total: total,
          pages: Math.ceil(total / itemsPerPage),
          follows,
        });
      }
    );
}

// METODO PARA DEVOLVER LISTADO DE USUARIOS SIN PAGINACION
function getMyFollows(req: any, res: any) {
  var userId = req.user.sub;

  var find = Follow.find({ user: userId });

  if (req.params.followed) {
    find = Follow.find({ followed: userId });
  }

  find.populate('user followed').exec((err: string, follows: any) => {
    if (err) return res.status(500).send({ message: 'Error en el servidor' });

    if (!follows)
      return res
        .status(404)
        .send({ message: 'No hay usuarios para visualizar' });

    return res.status(200).send({ follows });
  });
}

module.exports = {
  saveFollow,
  deleteFollow,
  getFollowingUser,
  getFollowedUsers,
  getMyFollows,
};
