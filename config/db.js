const DB_NAME = 'pre_smart_sse';

const config = {
  DB_NAME,
  /**
   * redis config
   */
  opt: {
    no_ready_check: true,
    port: 5360,
    host: 'ap2.jd.local',
    password: '/redis/cluster/1:1803528818953446384',
  },
};

module.exports = config;
