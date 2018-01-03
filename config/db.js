const dev = {
  port: 5360,
  host: 'ap2.jd.local',
  password: '/redis/cluster/1:1803528818953446384',
};

const prod = { };

const base = {
  no_ready_check: true,
};

module.exports = Object.assign(
  {}, 
  base, 
  process.env.NODE_ENV === 'production' ? prod : dev
);

