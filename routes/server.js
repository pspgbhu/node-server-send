/**
 * exports api for java side.
 */

const router = require('koa-router')();
const sse = require('../libs/sse');
const apiConfig = require('../config/api');

router.prefix(apiConfig.SERVER_PREFIX);

router.post('/pushdata', async (ctx) => {

  const body = ctx.request.body;
  const ssid = ctx.cookies.get('ssid');

  console.log('SSE keys :::', Object.keys(global.table));
  if (ssid && global.table[ssid]) {
    global.table[ssid].send(JSON.stringify(body));
    ctx.body = { code: 0, msg: 'success' };
  } else {
    ctx.body = { code: 1, msg: 'cannot find client' };
  }
});

module.exports = router;
