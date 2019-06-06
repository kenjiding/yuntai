import Base from '@/api/Base';

class CustomerAppeal extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 根据门店/场地获取对应的设备列表
  getDeviceListByTenant (data) {
    return this.get('/yunyoutenant/api/v1/CustomerAppeal/GetDeviceListByTenant', data);
  };

  // 获取门店列表
  getTenantList (data) {
    return this.get('/yunyoutenant/api/v1/CustomerAppeal/GetTenantList', data);
  };

  // 根据设备编号查找机台
  getDeviceByNumber (data) {
    return this.get('/yunyoutenant/api/v1/CustomerAppeal/GetDeviceByNumber', data);
  };

  // 获取设备投币记录
  getCoinInLogs (data) {
    return this.get('/yunyoutenant/api/v1/CustomerAppeal/GetCoinInLogs', data);
  };

  // 获取设备补币记录
  getCompensateLogs (data) {
    return this.get('/yunyoutenant/api/v1/CustomerAppeal/GetCompensateLogs', data);
  };

  // 取消投币记录
  cancelCoinInLog (data) {
    return this.post('/yunyoutenant/api/v1/CustomerAppeal/CancelCoinInLog', data);
  };

  // 补币到会员
  compensateToLeaguer (data) {
    return this.post('/yunyoutenant/api/v1/CustomerAppeal/CompensateToLeaguer', data);
  };

  // 补币到设备
  compensateToDevice (data) {
    return this.post('/yunyoutenant/api/v1/CustomerAppeal/CompensateToDevice', data);
  };

  // 轮询获取设备补币结果
  getCompensateResult (data) {
    return this.get('/yunyoutenant/api/v1/CustomerAppeal/GetCompensateResult', data);
  };
//{actions}
}

export default new CustomerAppeal();
