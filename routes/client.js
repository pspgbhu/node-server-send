const router = require('koa-router')();
// const bll = require('../bin');

router
  .get('/', async (ctx) => {
    ctx.body = 'index';
  })
;

module.exports = router;
