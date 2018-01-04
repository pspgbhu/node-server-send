# 夏普晓乐 Node 中间层

Node 作为中间层与客户端建立 SSE 长连接，Java 层通过调用 Node 层接口来向客户端下发数据。

## API For Client

### 接受语音控制数据推送

客户端通过 SSE 长连接来接受语音控制的数据推送

| 调用方式 | 入参 | 接口 |
| ----- | -- | --- |
|  SSE  | 无（需携带cookie）| /api/v1/alive/acceptdata |

**SSE 事件：**

| 事件名称 | 描述 | 返回值（JSON字符串） |
| ---  | ---- | ---- |
| connected | 长连接连接成功时返回 | { "code": "0", msg: "success" } |
| message | 数据推送 | 参考这里 |


## API For Server Side

### 通过 SSE 向客户端下发数据

Node 会将请求来的数据通过长链接透传至客户端上。

| 调用方式 | 入参 | 接口 |
| ----- | -- | --- |
|  post  | 无（需携带cookie，同时 cookie 中应包含 ssid 字段）| /api/v1/server/postdata |


**返回值：**

| 参数名 | 类型 | 描述 |
| ----- | -- | -- |
| code | String | code 码 |
| msg  | String | Code 对应的消息 |

**code 值：**

| code 值（都是字符串类型）| 备注 |
| ----- | -- |
| 0       | 成功 |
| 1       | 参数错误，即没有携带 cookie 或 cookie 中未包含 ssid 字段  |
| 10       | 未发现对应的客户端长连接  |
| -1      | 系统异常 |


