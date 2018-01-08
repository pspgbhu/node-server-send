const router = require('koa-router')();
const { API_PREFIX } = require('../config');
const alive = require('./alive');
const server = require('./server');


module.exports = router;

router.use(`${API_PREFIX}`, alive.routes(), alive.allowedMethods());
router.use(`${API_PREFIX}`, server.routes(), server.allowedMethods());
