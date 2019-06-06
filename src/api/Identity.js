import Base from '@/api/Base';

class Identity extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 完善资料信息
  getIdentityData (data) {
    return this.get('/YunyouTenant/api/v1/Identity/GetIdentityData', data);
  };

  // 完善资料
  postIdentityData (data) {
    return this.get('/YunyouTenant/api/v1/Identity/PostIdentityData', data);
  };

  // 编辑完善资料
  editIdentityData (data) {
    return this.post('/YunyouTenant/api/v1/Identity/EditIdentityData', data);
  };

  // 获取验证金额
  getCheckMoney (data) {
    return this.get('/YunyouTenant/api/v1/Identity/GetCheckMoney', data);
  };
  // 验证，验证款
  aysnCheckMoney (data) {
    return this.get('/YunyouTenant/api/v1/Identity/AysnCheckMoney', data);
  };
//{actions}
}

export default new Identity();
