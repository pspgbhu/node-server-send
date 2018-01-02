/**
 * exports api for client side.
 */

const router = require('koa-router')();
const sse = require('../libs/sse');

router
  .get('/test', async (ctx) => {
    // otherwise node will automatically close this connection in 10 minutes.
    ctx.req.setTimeout(1000 * 60 * 10);
    ctx.type = 'text/event-stream; charset=utf-8';
    ctx.set('Cache-Control', 'no-cache');
    ctx.set('Connection', 'keep-alive');

    const body = ctx.body = new sse();

    const ssid = ctx.cookies.get('ssid');
    if (ssid) {
      global.db[ssid] = body;
    }

    body.send(JSON.stringify({ code: 0, message: 'success', ssid }), 'connected');

    // // if the connection closes or errors,
    // // we stop the SSE.
    const socket = ctx.socket;
    socket.on('error', close);
    socket.on('close', close);

    function close() {
      body.end();
      socket.removeListener('error', close);
      socket.removeListener('close', close);
      delete global.db[ssid];
    }
  })
;

module.exports = router;
