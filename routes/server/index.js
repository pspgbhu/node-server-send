/**
 * exports api for other server side.
 */
const router = require('koa-router')();
const { findInstance } = require('../../utils');
const { API_PREFIX } = require('../../config');


module.exports = router;

/**
 * 通过该接口可以通过向客户端推送消息
 */
router.post('/pushdata', async (ctx, next) => {
  console.log('收到参数:', ctx.request.body);
  const { ssid, body } = JSON.parse(ctx.request.body);

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
    const url = `${protocol}://${ip}/${API_PREFIX}/pushdata`;

    console.log(`IP ${global.IP} redirect to`, url);

    ctx.redirect(url);
    ctx.ctx.status = 302;

  } catch (error) {
    // 没有找到对应的客户端
    ctx.body = { code: '10', msg: 'cannot find client' };
  }
});
