# SSE 推送系统

该系统可以同客户端建立 SSE 长连接，不仅该系统自己可以向客户端推送数据，还支持调用接口推送数据给特定的客户端。

## 环境要求

- Node >= 8.0
- PM2

## 准备工作

**设置配置文件：** 将 `config/index.js.example`，文件重命名为 `index.js`。

## 运行

本地开发:
```bash
$ npm run dev   # 启动成功后打开 http://localhost:3000 进行调试
```

生产部署:
```
$ npm start
```

## API

### 建立 SSE 长连接

客户端调用接口以建议和该系统间的长连接。

客户端 cookie 中必须使用 ssid 字段作为用户的唯一标识

| 调用方式 | 入参 | 接口 |
| ----- | -- | --- |
|  SSE  | 无（需携带cookie，且 cookie 中必须包含 ssid 字段）| /api/v1/acceptdata |

**SSE 事件：**

| 事件名称 | 描述 | 返回值 |
| ---  | ---- | ---- |
| connected | 长连接连接成功时返回 | JSON `{ "code": "0", msg: "success" }` |
| message | 数据推送 | JSON 或 String |


```javascript
var source = new EventSource('/api/v1/alive/acceptdata');
source.addEventListener('open', function (event) {
  console.log('open');
}, false);
source.addEventListener('message', function (event) {
  console.log(event);
  console.log('message');
}, false);
source.addEventListener('error', function (event) {
  console.log('error');
});
```


### 向特定客户端下发数据

Node 会将请求来的数据通过长链接透传至客户端上。

| 调用方式 | 入参 | 接口 |
| ----- | -- | --- |
|  post  | 见下表 | /api/v1/pushdata |

**入参：**

| 参数名 | 类型 | 描述 |
| ----- | -- | -- |
| ssid | String | 数据推向的客户端 ssid |
| data | String | 下发的数据 |

**返回值：**

| 参数名 | 类型 | 描述 |
| ----- | -- | -- |
| code | String | code 码 |
| msg  | String | Code 对应的消息 |

**code 值：**

| code 值（都是字符串类型）| 备注 |
| ----- | -- |
| 0       | 成功 |
| 1       | 参数错误 |
| 10      | 未发现对应的客户端长连接  |
| -1      | 系统异常 |

## 负载均衡

由于存在客户端与服务器的长连接是一对一的，当调用推送数据接口时，就存在一个内网转发请求到与客户端建立长连接的服务器上。

幸运的是，这些工作在这个系统中都已经被实现了，只不过需要借助于 Redis。如果你需要启动该功能请在 `config/index.js` 中设置 `isUseRedis` 的值为 true，同时在 `RedisOpts` 配置 Redis 相关参数。
