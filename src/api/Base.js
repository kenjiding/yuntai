import axios from 'axios';
import httpInit from '@/config/http';

// 处理baseURl
const handleBaseUrl = (baseUrl, isMock) => {
  const { VUE_APP_MOCK, VUE_APP_MOCK_URL } = process.env;

  // 在以下两种情况下不做任何处理
  // 1、 已http开头
  // 2、 baseUrl 与 isMock 都没传
  if (
    (baseUrl && baseUrl.indexOf('http') === 0) ||
    (baseUrl === undefined && isMock === undefined)
  ) {
    return baseUrl;
  }

  if (
    (VUE_APP_MOCK === 'private' &&
    isMock === true) ||
    VUE_APP_MOCK === 'true'
  ) {
    return VUE_APP_MOCK_URL + baseUrl;
  }

  return `/${baseUrl}`;
};

class Base {
  constructor (baseUrl, mock) {
    this.baseUrl = handleBaseUrl(baseUrl, mock);
    this.client = httpInit(this.baseUrl);
  }

  baseMethod (methodName, {url = '', data = null, config = {}}) {
    /*
      当没有配置取消请求参数时，默认添加
      用于在没有登录信息时，中断请求
    */
    if (!config.cancelToken) {
      let CancelToken = axios.CancelToken;
      let cancelFn;
      config.cancelToken = new CancelToken((c) => {
        cancelFn = c;
      });
      config.cancelFn = cancelFn;
    }
    let methodsFn = this.client[methodName];

    let promise = data ? methodsFn(url, data, config) : methodsFn(url, config);
    return promise;
  }

  post (url = '', data = {}, config = {}) {
    return this.baseMethod('post', {url, data, config});
  }

  get (url = '', data = {}, config = {}) {
    const tempConfig = Object.assign({}, config, { params: data });
    return this.baseMethod('get', {url, config: tempConfig});
  }

  delete (url = '', data = {}, config = {}) {
    const tempConfig = Object.assign({}, config, { params: data });
    return this.baseMethod('delete', {url, config: tempConfig});
  }

  put (url = '', data = {}, config = {}) {
    return this.baseMethod('put', {url, data, config});
  }

  patch (url = '', data = {}, config = {}) {
    return this.baseMethod('put', {url, data, config});
  }
}

export default Base;
