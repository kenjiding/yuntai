import Base from '@/api/Base';

class User extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 用户注册
  registration (data) {
    return this.post('/YunyouTenant/api/v1/User/Registration', data);
  };

  // 用户注册，验证手机验证码是否正确
  checkPhoneCode (data) {
    return this.post('/YunyouTenant/api/v1/User/CheckPhoneCode', data);
  };

  // 判断用户是否关联其他用户
  merchantList (data) {
    return this.post('/YunyouTenant/api/v1/User/MerchantList', data);
  };

  // 首次登陆填写门店资料
  tenantInfo (data) {
    return this.post('/YunyouTenant/api/v1/User/TenantInfo', data);
  };

  // 获取主账号和子账号列表
  getAllAccountList (data) {
    return this.get('/YunyouTenant/api/v1/User/GetAllAccountList', data);
  };

  // 启用支付功能，需要填写的资料
  bankCartInfo (data) {
    return this.post('/YunyouTenant/api/v1/User/BankCartInfo', data);
  };

  // 获取主体名称
  getUserName (data) {
    return this.get('/YunyouTenant/api/v1/User/GetUserName', data);
  };

  // 获取用户资料
  getTenantData (data) {
    return this.get('/YunyouTenant/api/v1/User/GetTenantData', data);
  };

  // 切换主体，获取账号列表信息
  getAccountList (data) {
    return this.get('/YunyouTenant/api/v1/User/GetAccountList', data);
  };

  getAccountDataList (data) {
    return this.get('/YunyouTenant/api/v1/User/GetAccountDataList', data);
  }
//{actions}
}

export default new User();
