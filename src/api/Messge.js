import Base from '@/api/Base';

class Messge extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取验证码
  getPhoneCode (data) {
    return this.get('/YunyouTenant/api/v1/Message/GetPhoneCode', data, {
      ignoreErrCode: ['2023000002'],
    });
  };

  // 获取图形验证码
  getImgCode (data) {
    return this.get('/YunyouTenant/api/v1/Message/GetImgCode', data);
  };
//{actions}
}

export default new Messge();
