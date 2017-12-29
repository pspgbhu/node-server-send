const router = require('koa-router')();

router.prefix('/server');

router
  .get('/', async (ctx) => {
    ctx.body = 'index';
  })
;

module.exports = router;
