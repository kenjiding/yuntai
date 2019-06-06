import Base from '@/api/Base';

class Account extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 通过账号密码登录,可能需要验证码,如果ErrorCode=20001,消息体会就是ImgCodeID,通过/Identity/api/V1/LoginImgCode获取图形验证码,登录成功后将Token放到请求头的Authorization字段就可进行身份认证,系统将自动进行续期不需要更换Token
  login (data) {
    return this.post('/Identity/api/v1/Account/Login', data, {
      tokenIgnore: true,
      ignoreErrCode: ['20090000002'],
    });
  };

  // 退出登录
  logout (data) {
    return this.post('/Identity/api/v1/Account/Logout', data);
  };

  //
  resetPassword (data) {
    return this.post('/Identity/api/v1/Account/ResetPassword', data);
  };

  // 忘记密码
  forgetPassword (data) {
    return this.post('/Identity/api/v1/Account/ForgetPassword', data);
  };

  // 通过主体ID，电话号码登录
  loginById (data) {
    return this.post('/Identity/api/v1/Account/LoginById', data);
  };

  // 获取登录信息,如果ErrorCode=20002,等于需要重新登录
  getLoginInfo (data) {
    return this.get('/Identity/api/v1/Account/GetLoginInfo', data);
  };
//{actions}
}

export default new Account();
