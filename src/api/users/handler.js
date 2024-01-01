/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class UsersHandler {
  constructor(validator, service) {
    this._validator = validator;
    this._service = service;

    autoBind(this);
  }

  async postUserHandler(req, h) {
    this._validator.validateUserPayload(req.payload);
    const { username, password, fullname } = req.payload;

    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });

    const res = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });

    res.code(201);
    return res;
  }

  async getUserByIdHandler(req) {
    const { id } = req.params;
    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

module.exports = UsersHandler;
