const router = require('koa-router')();
// const bll = require('../bin');

router
  .get('/sse', async (ctx) => {
    ctx.body = 'test';
  })
;

module.exports = router;
