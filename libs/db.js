const redis = require('redis');
const dbSettings = require('../config/db');
const client = redis.createClient(dbSettings);

module.exports = client;

client.on('error', err => {
  console.log('Redis Error  ', err);
});

client.on('warning', warn => {
  console.log('Redis Warn  ', warn);
});

client.on('connect', () => {
  console.log('Redis connected.');
});

client.on('reconnecting', () => {
  console.log('Redis trying to reconnect to the Redis sever.');
});

client.on('end', () => {
  console.log('Redis server connection has closed.');
});

client.$get = field => {
  return new Promise((resolve, reject) => {
    client.hgetall(field, (err, obj) => {
      if (err) { reject(err) }
      resolve(obj);
    });
  });
};

