/**
 * exports api for java side.
 */

const router = require('koa-router')();
const sse = require('../libs/sse');

router.prefix('/server');

router
  .post('/test', async (ctx) => {
    const body = ctx.request.body;
    const ssid = ctx.cookies.get('ssid');

    if (ssid && global.db[ssid]) {
      global.db[ssid].send(JSON.stringify(body));
      ctx.body = { code: 0, message: 'success' };
    } else {
      ctx.body = { code: 1, message: 'cannot find client' };
    }
  })
;

module.exports = router;
