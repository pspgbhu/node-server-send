/**
 * exports api for client side.
 */

const router = require('koa-router')();
const redis = require('../../libs/db');
const { setSSEHeader } = require('../../utils/router');
const SSE = require('../../libs/sse');
const { isUseRedis, DB_NAME } = require('../../config').DB_NAME;

module.exports = router;

/**
 * 建立长连接接口
 */
router.get('/acceptdata', setSSEHeader, (ctx) => {
  const body = ctx.body = new SSE();
  const ssid = ctx.cookies.get('ssid');

  if (ssid) {
    // setting ssid to local cache & redis
    global.table[ssid] = body;
  }

  if (ssid && isUseRedis) {
    redis.HMSET(DB_NAME, { [ssid]: global.IP });
    // log local cache & redis
    redis.$get(DB_NAME).then(obj => {
      console.log(`Redis ${DB_NAME} :::`, JSON.stringify(obj));
    }).catch(e => {
      console.log('Redis Get Error :::', e);
    });
  }

  // 连接成功后向客户端推送一条连接成功的消息
  body.send(JSON.stringify({ code: 0, msg: 'success' }), 'connected');

  // 监听连接情况
  const socket = ctx.socket;
  socket.on('error', close);
  socket.on('close', close);

  function close() {
    body.end();
    socket.removeListener('error', close);
    socket.removeListener('close', close);
    // 从本地缓存和 Redis 中移除对象
    delete global.table[ssid];

    if (isUseRedis) {
      redis.HDEL(DB_NAME, ssid);
    }
  }
});
