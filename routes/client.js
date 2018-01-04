/**
 * exports api for client side.
 */

const router = require('koa-router')();
const db = require('../libs/db');
const sse = require('../libs/sse');
const apiConfig = require('../config/api');

router.prefix(apiConfig.ALIVE_PREFIX);

router.get('/acceptdata', async (ctx) => {
  const body = ctx.body = new sse();
  const ssid = ctx.cookies.get('ssid');

  if (ssid) {
    global.table[ssid] = body;
    db.HMSET('xiaoleSSE', { [ssid]: global.IP });
    db.$get('xiaoleSSE').then(obj => {
      console.log('Redis xiaoleSSE :::', JSON.stringify(obj));
    }).catch(e => {
      console.log('Redis Get Error :::', )
    });
  }

  body.send(JSON.stringify({ code: 0, msg: 'success' }), 'connected');

  const socket = ctx.socket;
  socket.on('error', close);
  socket.on('close', close);

  function close() {
    body.end();
    socket.removeListener('error', close);
    socket.removeListener('close', close);
    delete global.table[ssid];
    db.HDEL('xiaoleSSE', ssid);
  }
});

module.exports = router;
