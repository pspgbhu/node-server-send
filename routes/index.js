const router = require('koa-router')();
const { API_PREFIX } = require('../config');
const alive = require('./alive');
const server = require('./server');

module.exports = router;

router.prefix(API_PREFIX);

router.use(alive.routes(), alive.allowedMethods());
router.use(server.routes(), server.allowedMethods());
