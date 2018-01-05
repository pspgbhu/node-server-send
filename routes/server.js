/**
 * exports api for other server side.
 */
const router = require('koa-router')();
const db = require('../libs/db');
const apiConfig = require('../config/api');

const DB_NAME = require('../config/db').DB_NAME;

module.exports = router;

/**
 * 面向服务端的接口添加统一 PREFIX
 */
router.prefix(apiConfig.SERVER_PREFIX);

/**
 * 由服务端调用，通过该接口可以通过向客户端推送消息
 */
router.post('/pushdata', async (ctx) => {
  const body = ctx.request.body;
  const ssid = ctx.cookies.get('ssid');
  console.log(ctx.protocol);

  // 错误码 10
  if (!ssid) {
    ctx.body = { code: '1', msg: '参数错误' };
    return;
  }

  // 如果本地缓存里有 ssid 对应关系，就直接向客户端推送数据
  if (global.table[ssid]) {
    // 向客户端
    global.table[ssid].send(JSON.stringify(body));
    ctx.body = { code: '0', msg: 'success' };
    return;
  }

  // 本地没有 ssid 对应关系的话，就去 redis 里面找
  try {
    // 找到了，302 重定向到正确的内网服务器
    const ip = await findInstance(ssid);
    const protocol = ctx.protocol;
    const url = `${protocol}://${ip}/${apiConfig.ALIVE_PREFIX}/pushdata`;

    console.log(`IP ${global.IP} redirect to`, url);

    ctx.redirect(url);
    ctx.ctx.status = 302;

  } catch (error) {
    // 没有找到对应的客户端
    ctx.body = { code: '10', msg: 'cannot find client' };
  }
});


/**
 * 因为多台容器负载均衡的原因，所以 Node 容器需要将其他服务端发来的请求正确的转发到正确的容器上。
 * 根据 ssid 去查找对应的容器实例
 * @param {String} ssid cookie 中的 ssid
 */
function findInstance(ssid) {
  return new Promise((resolve, reject) => {
    // 在 Redis 中查找对应关系
    let xiaoleSSE = null;

    db.$get(DB_NAME).then(obj => { xiaoleSSE = obj; });

    const ip = xiaoleSSE[ssid];

    // 如果 redis 中没有找到，则 reject
    if (!ip) {
      reject();
    }

    // 如果在 redis 中查找的 IP 等于本机 IP
    if (ip === global.IP) {
      reject();
    }

    resolve(ip);
  });
}
