const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

module.exports = router
