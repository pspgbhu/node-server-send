const router = require('koa-router')();
const SelfEvents = require('../common/SelfEvents');

router.prefix('/server');

router
  .get('/test', async (ctx) => {

  })
;

module.exports = router;
