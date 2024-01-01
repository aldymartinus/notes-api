/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class NoteHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(req, h) {
    try {
      this._validator.validateNotePayload(req.payload);
      const { title = 'untitled', body, tags } = req.payload;
      const noteId = await this._service.addNote({ title, body, tags });

      const res = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId,
        },
      });
      res.code(201);
      return res;
    } catch (error) {
      if (error instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: error.message,
        });

        res.code(error.statusCode);
        return res;
      }

      const res = h.response({
        status: 'fail',
        message: error.message,
      });
      res.code(error.statusCode);
      return res;
    }
  }

  async getNotesHandler() {
    const notes = await this._service.getNotes();

    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const note = await this._service.getNoteById(id);

      return {
        status: 'success',
        data: {
          note,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: error.message,
        });

        res.code(error.statusCode);
        return res;
      }

      const res = h.response({
        status: 'fail',
        message: error.message,
      });

      res.code(error.statusCode);
      return res;
    }
  }

  async putNoteByIdHandler(req, h) {
    try {
      this._validator.validateNotePayload(req.payload);
      const { id } = req.params;
      await this._service.editNoteById(id, req.payload);

      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: error.message,
        });
        res.code(error.statusCode);
        return res;
      }

      const res = h.response({
        status: 'fail',
        message: error.message,
      });
      console.log(error);
      res.code(error.statusCode);
      return res;
    }
  }

  async deleteNoteByIdHandler(req, h) {
    try {
      const { id } = req.params;
      await this._service.deleteNoteById(id);

      return {
        status: 'success',
        message: 'Catatan berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: error.message,
        });

        res.code(error.statusCode);
        return res;
      }

      const res = h.response({
        status: 'fail',
        message: error.message,
      });

      res.code(error.statusCode);
      return res;
    }
  }
}

module.exports = NoteHandler;
