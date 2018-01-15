const db = require('../libs/db');
const DB_NAME = require('../config').DB_NAME;

/**
 * 向特定的客户端推送数据
 * @param {Object}
 *  {
 *    ssid,
 *    data
 *  }
 */
exports.pushdata = ({ ssid, data }) => {

};


/**
 * 因为多台容器负载均衡的原因，所以 Node 容器需要将其他服务端发来的请求正确的转发到正确的容器上。
 * 根据 ssid 去查找对应的容器实例
 * @param {String} ssid cookie 中的 ssid
 */
exports.findInstance = (ssid) => new Promise((resolve, reject) => {
  // 在 Redis 中查找对应关系
  let xiaoleSSE = null;
  db.$get(DB_NAME).then(obj => { xiaoleSSE = obj; });
  const ip = xiaoleSSE[ssid];

  // 如果 redis 中没有找到，则 reject
  if (!ip) {
    reject();
    return;
  }

  // 如果在 redis 中查找的 IP 等于本机 IP
  if (ip === global.IP) {
    reject();
    return;
  }

  resolve(ip);
});
