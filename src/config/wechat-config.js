import Wechat from '@/api/Wechat';
import Dialog from '@/components/global/dialog';

let configUrl;
let currentUrl;

function isSameHref () {
  return configUrl === currentUrl;
}

export const setHref = (url) => {
  currentUrl = url;
};

export const setConfig = (url) => {
  let executeFailNum = 0;
  configUrl = url;

  const againExecute = () => {
    executeFailNum++;
    setTimeout(() => asyncFetchWechatConfig(), 200);
  };

  const asyncFetchWechatConfig = () => {
    if (process.env.NODE_ENV !== 'production') return;
    if (executeFailNum >= 5) {
      Dialog.alert({
        title: '提示',
        theme: 'danger',
        message: '微信授权功能，授权失败！点击“确认”按钮，重新加载页面',
      }).then(() => {
        window.location.reload();
      });
      // 扫码已经失败，但是不提示
      return;
    }

    Wechat.wechatConfig({PageUrl: url || window.location.href})
      .then(config => {
        if (!isSameHref()) return;

        window.$_wx.config({
          debug: process.env.VUE_APP_WX_DEBUG === 'true',
          appId: config.AppID,
          timestamp: config.Timestamp,
          nonceStr: config.NonceStr,
          signature: config.Signature,
          jsApiList: [
            'scanQRCode',
            'onMenuShareAppMessage',
            'onMenuShareTimeline',
            'chooseWXPay',
          ],
        });
        // 隐藏非基本类菜单
        // window.$_wx.hideAllNonBaseMenuItem();
        // window.$_wx.error(res => againExecute());
      }, () => {
        if (!isSameHref()) return;
        againExecute();
      });
  };

  window.$_wx.error((res) => againExecute());

  asyncFetchWechatConfig();
};
