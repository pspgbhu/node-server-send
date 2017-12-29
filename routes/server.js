const router = require('koa-router')();
const sse = require('../bll/sse');
const db = require('../bll/db');
const PassThrough = require('stream').PassThrough;

router.prefix('/server');

const cache = {};

let cookie = 1;

router
  .get('/test', async (ctx) => {
    cookie += 1;
    // otherwise node will automatically close this connection in 2 minutes
    ctx.req.setTimeout(Number.MAX_VALUE);

    ctx.type = 'text/event-stream; charset=utf-8';
    ctx.set('Cache-Control', 'no-cache');
    ctx.set('Connection', 'keep-alive');

    // ctx.body = 'event: foo\ndata: a foo event\n\n';
    // ctx.body = someHTTPStream.on('error', ctx.onerror).pipe(PassThrough());

    const body = ctx.body = sse();
    cache[cookie] = db.subscribe('some event');
    cache[cookie].pipe(body);

    // // if the connection closes or errors,
    // // we stop the SSE.
    const socket = ctx.socket;
    socket.on('error', close);
    socket.on('close', close);

    setTimeout(() => {
      cache[cookie].push('{"a": ' + cookie + '}');
    }, 3000);

    function close() {
      cache[cookie].unpipe(body);
      socket.removeListener('error', close);
      socket.removeListener('close', close);
      delete cache[cookie];
    }
  })
;

module.exports = router;
