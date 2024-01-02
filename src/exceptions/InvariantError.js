const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(msg, statusCode = 400) {
    super(msg, statusCode);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
