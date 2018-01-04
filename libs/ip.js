const os = require('os');
const ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  let alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    console.log('Got IP: ', iface.address);
    ip = iface.address;
    // if (alias >= 1) {
    //   // this single interface has multiple ipv4 addresses
    //   console.log(ifname + ':' + alias, iface.address);
    // } else {
    //   // this interface has only one ipv4 adress
    //   console.log(ifname, iface.address);
    // }
    // ++alias;
  });
});

module.exports = ip;
