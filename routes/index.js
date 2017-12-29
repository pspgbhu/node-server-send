const router = require('koa-router')();

const client = require('./client');
const server = require('./server');

router.use(client.routes(), client.allowedMethods());
router.use(server.routes(), server.allowedMethods());

module.exports = router;
