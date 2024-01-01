const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { validator, service }) => {
    const userHandler = new UsersHandler(validator, service);
    server.route(routes(userHandler));
  },
};
