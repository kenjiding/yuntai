import axios from 'axios';
import { Toast } from 'vant';
import Dialog from '@/components/global/dialog';
import store from '@/store';
// import router from '@/router';

const NODE_ENV = process.env.NODE_ENV;
let LoginDialog = false;

let errorDialog = (msg) => Dialog.alert({
  message: msg,
  title: '提示',
  theme: 'danger',
});

const handleRequestConfig = (userToken = null, config = {}) => {
  let tempConfig = Object.assign({}, config);
  if (!config.tokenIgnore) {
    tempConfig.headers.Authorization = userToken;
  }
  return tempConfig;
};

const goLogin = (msg) => {
  if (LoginDialog) return Promise.reject;

  LoginDialog = true;

  return new Promise((resolve, reject) => {
    let fn = () => {
      store.commit('clearUserInfo');
      window.$router.replace('/login');
      return reject;
    };

    let timer = setTimeout(() => {
      Dialog.close();
      fn();
    }, 2000);

    errorDialog(`${msg} <br/> 两秒后自动跳转`).then(() => {
      clearTimeout(timer);
      fn();
    });
  });
};

const handleBackendError = ({ data, config }) => {
  const response = data.ResponseStatus;
  const errCode = response.ErrorCode;
  const errMsg = response.Message;
  // 忽略当前请求的部分异常错误码
  const ignoreErrCode = config.ignoreErrCode || [];
  if (ignoreErrCode.indexOf(errCode) < 0) {
    const tipErrorMsg = NODE_ENV !== 'production' ? `${errMsg}(${errCode})` : `${errMsg}`;
    errorDialog(tipErrorMsg);
  }

  return true;
};

const afterResponseSuccess = (res) => {
  const { data } = res;

  if (Number(data.ResponseStatus.ErrorCode) !== 0) {
    // 关闭全局Toast
    Toast.clear();
    // 如果有错误码忽略，则返回完整响应
    if (handleBackendError(res)) {
      return Promise.reject(data);
    }
  }
  return Promise.resolve(data.Data);
};

const requestFn = client => client.interceptors.request.use(
  config => {
    const userToken = store.getters.getToken;

    return handleRequestConfig(userToken, config);
  }, error => Promise.reject(error)
);

// 处理http异常状态
const handleHttpError = ({ response, status }) => {
  let errorMsg;
  status = response.status;

  if (status >= 500) {
    if (NODE_ENV !== 'production') {
      errorMsg = (response.data.ResponseStatus && response.data.ResponseStatus.Message) || '服务器异常';
    } else {
      errorMsg = '小芸开了个小差，请重试!';
    }
  } else if (status >= 300) {
    // http 请求超时
    if (status === 408) {
      errorMsg = '请求超时！';
    } else if (status === 401) {
      errorMsg = '授权失败！';
    } else {
      errorMsg = '请求错误！';
    }
  }

  return errorMsg;
};

// code状态码200判断
const responseFn = client => client.interceptors.response.use(
  res => afterResponseSuccess(res),
  (error) => {
    // 关闭全局Toast
    Toast.clear();
    let errorMsg = '';
    // 请求已发出，但服务器响应的状态码不在 2xx 范围内
    if (error.response) {
      if (error.response.status === 401) {
        return goLogin('登录超时，请重新登录！');
      }
      errorMsg = handleHttpError(error);
    } else {
      // axios 请求超时
      if (error) {
        if (typeof error === 'object') {
          if (error.message) {
            errorMsg = (error.message.indexOf('timeout') !== -1) ? '请求超时！' : error.message;
            if (errorMsg === 'Network Error') {
              errorMsg = '网络异常';
            }
          }
        } else if (typeof error === 'string') {
          if (error === 'Network Error') {
            error = '网络异常';
          } else {
            errorMsg = error;
          }
        }
      }
    }

    // storage不存在用户信息
    if (errorMsg === 'user not found in storage') {
      return goLogin('登录信息失效，请重新登录！');
    }

    if (errorMsg) {
      errorDialog(errorMsg);
    }

    return Promise.reject(error);
  }
);

const init = client => {
  responseFn(client);
  requestFn(client);
};

const createClient = baseURL => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  init(client);

  return client;
};

export default createClient;
