'use strict';

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

// METODO PARA GUARDAR NUEVOS MENSAJES
function saveMessage(req: any, res: any) {
  var params = req.body;

  if (!params.text || !params.receiver)
    return res.status(200).send({ message: 'Enviar los datos necesarios' });

  var message = new Message();
  message.emitter = req.user.sub;
  message.receiver = params.receiver;
  message.text = params.text;
  message.created_at = moment().unix();
  message.viewed = 'false';

  message.save((err: String, messageStored: any) => {
    if (err) return res.status(500).send({ message: 'Error en la petición' });

    if (!messageStored)
      return res.status(404).send({ message: 'Error al enviar el mensaje' });

    return res.status(200).send({ message: messageStored });
  });
}

// METODO PARA VER(listar) LOS MENSAJES RECIBIDOS
function getReceiveMessages(req: any, res: any) {
  var userId = req.user.sub;

  var page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  var itemPerPage = 5;

  Message.find({ receiver: userId })
    // En pupulate me permite pasar un segundo parametro especificando cuales campos quiero devolver en la vista
    .populate('emitter', '_id name surname nick image')
    .paginate(
      page,
      itemPerPage,
      (err: string, messages: any, total: number) => {
        if (err)
          return res.status(500).send({ message: 'Error en la petición' });

        if (!messages)
          return res.status(404).send({ message: 'No hay mensajes' });

        return res.status(200).send({
          total: total,
          pages: Math.ceil(total / itemPerPage),
          messages,
        });
      }
    );
}

// METODO PARA VER(listar) LOS MENSAJES QUE HE ENVIADO
function getEmmittedMessages(req: any, res: any) {
  var userId = req.user.sub;

  var page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  var itemPerPage = 5;

  Message.find({ emitter: userId })
    // En pupulate me permite pasar un segundo parametro especificando cuales campos quiero devolver en la vista
    .populate('reveiver emitter', '_id name surname nick image')
    .paginate(
      page,
      itemPerPage,
      (err: string, messages: any, total: number) => {
        if (err)
          return res.status(500).send({ message: 'Error en la petición' });

        if (!messages)
          return res.status(404).send({ message: 'No hay mensajes' });

        return res.status(200).send({
          total: total,
          pages: Math.ceil(total / itemPerPage),
          messages,
        });
      }
    );
}

// METODO PARA CONTABILIZAR LOS MENSAJES NO LEIDOS
function getUnviewedMessages(req: any, res: any) {
  var userId = req.user.sub;

  Message.count({ receiver: userId, viewed: 'false' }).exec(
    (err: string, count: number) => {
      if (err) return res.status(500).send({ message: 'Error en la petición' });

      return res.status(200).send({ unviewed: count });
    }
  );
}

// METODO PARA ACTUALIZAR EL REGISTRO DE MENSAJES NO LEIDOS A CERO CUANDO YA HAYAN SIDO LEIDOS
function setViewedMessages(req: any, res: any) {
  var userId = req.user.sub;

  Message.update(
    { receiver: userId, viewed: 'false' },
    { viewed: 'true' },
    { multi: 'true' },
    (err: string, messagesUpdate: boolean) => {
      if (err) return res.status(500).send({ message: 'Error en la petición' });

      return res.status(200).send({ messages: messagesUpdate });
    }
  );
}

module.exports = {
  saveMessage,
  getReceiveMessages,
  getEmmittedMessages,
  getUnviewedMessages,
  setViewedMessages,
};
