import store from '@/store';
import dialog from '@/components/global/dialog';
import { setConfig, setHref } from '@/config/wechat-config';
import { statistical } from '@/util/tool';

export default (router) => {
  //路由加载前
  router.beforeEach(({ query, meta, name, path }, from, next) => {
    let { entry = false } = query;
    let { requiresAuth = true, moduleName, title } = meta;

    let closedModules = (process.env.VUE_APP_MODULE_DISABLED || '').split(',');

    if (closedModules.includes(moduleName)) {
      dialog.alert({
        title: '提示',
        message: '该功能正在努力建设中，<br/>敬请期待',
        theme: 'warning',
      });
      return next(from.name === 'home' ? false : '/');
    }

    // 判断是否入口路由
    if (entry) {
      let { token = null, openid } = query;

      store.commit('setOpenId', openid);
      // 获取登录后的用户信息，需要token
      if (token) {
        store.commit('setUserInfo', { Token: token });
        store.dispatch('asyncfetchUserInfo');
      }
      // 入口信息保存后，清楚URL上的参数，
      let queryTemp = Object.assign({ 'entryAfter': true }, query);
      delete queryTemp.openid;
      delete queryTemp.token;
      delete queryTemp.entry;
      return next({
        path,
        query: queryTemp,
      });
      // 避免用户直接分享地址导致用户信息公用
      // return next();
    }

    let storeToken = store.getters.getToken || null;
    // 没有token时，重定向到login
    if (requiresAuth && !storeToken) {
      return next('/login');
    }
    // 在已经登录状态下，不能返回到登录页
    if (name === 'login' && storeToken) {
      return ~from.fullPath.indexOf('login') ? next('/') : next(from.path);
    }

    // 判断当前的页面路径是否设置了 title
    if (title) {
      document.title = title;
    } else {
      document.title = store.state.userInfo.CustomerName || '芸苔新零售';
    }

    next();
  });

  router.afterEach(({ fullPath, meta, param, path }, from) => {
    const { openJsSdk = false, requiresAuth = true } = meta;

    if (process.env.NODE_ENV === 'production') {
      const userInfo = store.state.UserInfo || {};
      let userId = userInfo.UserID || '';
      let tenantId = userInfo.TerminalID || '';
      if (userId) {
        userId = userId.split('-').join('').substr(8, 16);
      }

      if (tenantId) {
        tenantId = tenantId.split('-').join('').substr(8, 16);
      }
      // 生产环境 百度统计
      if (requiresAuth) {
        statistical(path);
      }
    }

    let userAgent = window.navigator.userAgent;
    let isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1; //android终端
    let isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    const url = `${location.origin}${process.env.VUE_APP_BASE_URL}${fullPath}`;
    setHref(url);

    if (openJsSdk && isAndroid) {
      console.log(`Android验签：${url}`);
      setConfig(url);
    } else if (isiOS && !window.entryUrl) {
      console.log(`iOS验签：${url}`);
      window.entryUrl = url;
      setConfig(url);
    }
  });
};
