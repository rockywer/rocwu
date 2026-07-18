// 统一请求封装
const app = getApp();
const BASE_URL = (app && app.globalData && app.globalData.BASE_URL) || 'http://127.0.0.1:3000';
const MAX_RETRIES = 2;
const TIMEOUT = 20000;

function request(method, path, data, retryCount = 0) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + path,
      method,
      data,
      header: { 'content-type': 'application/json' },
      timeout: TIMEOUT,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data);
        else if (res.statusCode >= 500 && retryCount < MAX_RETRIES) {
          request(method, path, data, retryCount + 1).then(resolve).catch(reject);
        } else {
          reject(new Error('HTTP ' + res.statusCode));
        }
      },
      fail: (err) => {
        const msg = (err && err.errMsg) || '';
        if (/timeout/i.test(msg) && retryCount < MAX_RETRIES) {
          request(method, path, data, retryCount + 1).then(resolve).catch(reject);
        } else if (/timeout/i.test(msg)) {
          reject(new Error('请求超时。请检查：1.后端服务是否运行 2.开发者工具勾选「不校验合法域名」3.网络代理设置'));
        } else if (/connect|refused/i.test(msg)) {
          reject(new Error('连接失败：后端服务未启动或地址错误，请确认服务运行在 ' + BASE_URL));
        } else {
          reject(err);
        }
      }
    });
  });
}

// 发送一条消息给智能体，返回 { reply, intent, sessionId }
function chat(message, sessionId) {
  return request('POST', '/api/chat', { message, sessionId });
}

function get(path) {
  return request('GET', path);
}

module.exports = { request, chat, get, BASE_URL };
