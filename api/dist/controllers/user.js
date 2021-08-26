'use strict';
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
function home(req, res) {
    res.status(200).send({
        message: 'Mean red social',
    });
}
// Metodo para registrar usuarios
function saveUser(req, res) {
    // Recoger los parametros del body
    var params = req.body;
    //  Crear una instancia del modelo de datos
    var user = User();
    // Verificar que los campos obligatorios vengan con datos en el body de la peticion
    if (params.name &&
        params.surname &&
        params.nick &&
        params.email &&
        params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        // Controlar usuarios duplicados
        // Mejorar este bloque del codigo, no esta asumiendo el campo nick para el control de duplicidad
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() },
            ],
        }).exec((err, users) => {
            if (err)
                return res
                    .status(500)
                    .send({ message: 'Error en la petición de usuarios' });
            if (users && users.length >= 1) {
                return res
                    .status(200)
                    .send({ message: 'El usuario que intenta registrar ya existe' });
            }
            else {
                // Generar la contraseña cifrada y guardar los datos
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStored) => {
                        if (err)
                            return res
                                .status(500)
                                .send({ message: 'Error al guardar el usuario' });
                        if (userStored) {
                            res.status(200).send({ user: userStored });
                        }
                        else {
                            res
                                .status(400)
                                .send({ message: 'No se ha registrado el usuario' });
                        }
                    });
                });
            }
        });
    }
    else {
        res.status(200).send({ message: 'Llenar todos los campos obligatorios' });
    }
}
// Metodo para loguear un usuario
function loginUser(req, res) {
    // Capturar los datos que me llegan en la petición del body
    var params = req.body;
    // Almacenar esos datos en variables
    var email = params.email;
    var password = params.password;
    // Verificar si los datos o usuario existe
    User.findOne({ email: email }, (err, user) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (user) {
            // El metodo compare de bcrypt encripta la password que recibimos para comprarla con la de la base de datos
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (params.gettoken) {
                        // Generar y devolver un token
                        return res.status(200).send({
                            token: jwt.createToken(user),
                        });
                    }
                    else {
                        // Devolver datos del usuario
                        user.password = undefined;
                        return res.status(200).send({ user });
                    }
                }
                else {
                    return res
                        .status(404)
                        .send({ message: 'El usuario no se ha podido identificar' });
                }
            });
        }
    });
}
// Metodo para extraer los datos de un usuario
function getUser(req, res) {
    var userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (!user)
            return res.status(404).send({ message: 'El usuario no existe' });
        user.password = undefined;
        return res.status(200).send({ user });
    });
}
module.exports = {
    home,
    saveUser,
    loginUser,
    getUser,
};
