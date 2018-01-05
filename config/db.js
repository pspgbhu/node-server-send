const DB_NAME = 'smart_sse';
const PRE_DB_NAME = 'pre_smart_sse';

const config = {
  DB_NAME: process.env.NODE_ENV === 'production' ? PRE_DB_NAME : PRE_DB_NAME,
};

/**
 * redis config
 */
const base = {
  no_ready_check: true,
};
const dev = {
  port: 5360,
  host: 'ap2.jd.local',
  password: '/redis/cluster/1:1803528818953446384',
};
const prod = { };


config.opt = Object.assign(base, process.env.NODE_ENV === 'production' ? dev : dev);


module.exports = config;
