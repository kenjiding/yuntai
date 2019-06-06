import Base from '@/api/Base';

class Tenant extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获得门店列表
  tenantList (data) {
    return this.get('/yunyoutenant/api/v1/Tenant/TenantList', data);
  };

  // 获取门店详细信息
  tenantDetail (data) {
    return this.get('/yunyoutenant/api/v1/Tenant/TenantDetail', data);
  };

  // 获取门店已经注册过的所有设备编号
  tenantDeviceSnList (data) {
    return this.get('/yunyoutenant/api/v1/Tenant/TenantDeviceSnList', data);
  };

  // 门店管理，获取门店信息列表
  getTenantInfoList (data) {
    return this.get('/yunyoutenant/api/v1/Tenant/GetTenantInfoList', data);
  };

  // 获取小程序风格设置
  getStyle (data) {
    return this.get('/yunyoutenant/api/v1/Tenant/GetStyle', data);
  }

  // 设置小程序风格
  saveStyle (data) {
    return this.post('/yunyoutenant/api/v1/Tenant/SetStyle', data);
  }
//{actions}
}

export default new Tenant();
