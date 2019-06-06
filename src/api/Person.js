import Base from '@/api/Base';

class Person extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取个人中心首页信息
  getPersonalInfo (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetPersonalInfo', data);
  };

  postPhoneBind (data) {
    return this.post('/YunyouTenant/api/v1/Person/PostPhoneBind', data);
  };

  updateIntegralRule (data) {
    return this.post('/YunyouTenant/api/v1/Person/UpdateIntegralRule', data);
  };

  editGameCoinName (data) {
    return this.post('/YunyouTenant/api/v1/Person/EditGameCoinName', data);
  };

  // 提交付款码信息
  postPayCodeInfo (data) {
    return this.post('/YunyouTenant/api/v1/Person/PostPayCodeInfo', data);
  };

  // 获取付款码信息
  getPayCodeInfo (data) {
    return this.post('/YunyouTenant/api/v1/Person/GetPayCodeInfo', data);
  };

  // 编辑主体信息
  editPersonInfo (data) {
    return this.post('/YunyouTenant/api/v1/Person/EditPersonInfo', data);
  };

  // 切换主体，获取账号列表
  getTenantList (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetTenantList', data);
  };

  // 意见反馈
  postFeedBack (data) {
    return this.post('/YunyouTenant/api/v1/Person/PostFeedBack', data);
  };

  // 网络设置
  postNetSetting (data) {
    return this.post('/YunyouTenant/api/v1/Person/PostNetSetting', data);
  };

  // 推送设置
  pushMessage (data) {
    return this.post('/YunyouTenant/api/v1/Person/PushMessage', data);
  };

  // 门店管理
  tenantOperation (data) {
    return this.get('/YunyouTenant/api/v1/Person/TenantOperation', data);
  };

  // 新增门店
  addTenant (data) {
    return this.post('/YunyouTenant/api/v1/Person/AddTenant', data);
  };

  // 删除门店
  deleteTenant (data) {
    return this.delete('/YunyouTenant/api/v1/Person/DeleteTenant', data, {
      ignoreErrCode: ['2005000009'],
    }
    );
  };

  // 编辑门店
  editTenant (data) {
    return this.post('/YunyouTenant/api/v1/Person/EditTenant', data);
  };

  // 子账号管理，获取子账号列表
  getChildAccountList (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetChildAccountList', data);
  };

  // 新增子账号
  addChildAccount (data) {
    return this.post('/YunyouTenant/api/v1/Person/AddChildAccount', data);
  };

  // 删除子账号
  deleteChildAccount (data) {
    return this.delete('/YunyouTenant/api/v1/Person/DeleteChildAccount', data);
  };

  // 编辑子账号
  editChildAccount (data) {
    return this.post('/YunyouTenant/api/v1/Person/EditChildAccount', data);
  };

  // 权限功能
  getPermissionData (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetPermissionData', data);
  };

  // 切换主体账号
  changeTenantAccount (data) {
    return this.get('/YunyouTenant/api/v1/Person/ChangeTenantAccount', data);
  };

  // 通过id获取门店信息
  getTenantInfoByID (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetTenantInfoByID', data);
  };

  // 获取积分规则
  getIntegrationRule (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetIntegrationRule', data);
  };

  // 获取推送设置信息
  getPushMessage (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetPushMessage', data);
  };

  // 获取网络设置信息
  getNetworkInfo (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetNetworkInfo', data);
  };

  // 通过id获取子账号信息
  getChildAccountInfo (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetChildAccountInfo', data);
  };

  // 保存功能权限数据
  postRolePermission (data) {
    return this.post('/YunyouTenant/api/v1/Person/PostRolePermission', data);
  };

  // 获取角色的权限
  getRolePermission (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetRolePermission', data);
  };

  // 获取主体的信息
  getMainUserInfo (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetMainUserInfo', data);
  };

  // 获得抹零设置
  wipeZeroSetting (data) {
    return this.get('/yunyoutenant/api/v1/Person/WipeZeroSetting', data);
  };

  // 修改抹零设置
  wipeZeroSettingEdit (data) {
    return this.post('/yunyoutenant/api/v1/Person/WipeZeroSettingEdit', data);
  };

  // 获得小票打印设置
  ticketPrinterSetting (data) {
    return this.get('/yunyoutenant/api/v1/Person/TicketPrinterSetting', data);
  };

  // 修改小票打印设置
  ticketPrinterSettingEdit (data) {
    return this.post('/yunyoutenant/api/v1/Person/TicketPrinterSettingEdit', data);
  };

  // 获取支付方式列表
  getPaymentList (data) {
    return this.get('/YunyouTenant/api/v1/Person/GetPaymentList', data);
  };

  // 新增支付方式
  addPayment (data) {
    return this.post('/YunyouTenant/api/v1/Person/AddPayment', data);
  };

  // 编辑支付方式
  editPayment (data) {
    return this.post('/YunyouTenant/api/v1/Person/EditPayment', data);
  };

  // 删除支付方式
  deletePayment (data) {
    return this.post('/YunyouTenant/api/v1/Person/DeletePayment', data);
  };
//{actions}
}

export default new Person();
