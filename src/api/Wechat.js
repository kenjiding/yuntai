import Base from '@/api/Base';

class Wechat extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取微信配置信息
  wechatConfig (data) {
    return this.get('/yunyoutenant/api/v1/Wechat/WechatConfig', data);
  };

  scan () {
    // 执行微信扫码
    return new Promise((resolve, reject) => {

    });
  };
//{actions}
}

export default new Wechat();
