/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const mapDBToModel = require('../../utils');

class NoteService {
  constructor() {
    this._pool = new Pool();
  }

  async addNote({ title, tags, body }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING ID',
      values: [id, title, body, tags, createdAt, updatedAt],
    };

    const res = await this._pool.query(query);
    if (!res.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return res.rows[0].id;
  }

  async getNotes() {
    const res = await this._pool.query('SELECT * FROM notes');
    return res.rows.map(mapDBToModel);
  }

  async getNoteById(id) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const res = await this._pool.query(query);

    if (!res.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return res.rows.map(mapDBToModel)[0];
  }

  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const res = await this._pool.query(query);

    if (!res.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = NoteService;
