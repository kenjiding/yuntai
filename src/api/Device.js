import Base from '@/api/Base';

class Device extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取设备详细信息
  deviceDetail (data) {
    return this.get('/yunyoutenant/api/v1/Device/DeviceDetail', data);
  };

  // 修改设备详情
  deviceEdit (data) {
    return this.post('/yunyoutenant/api/v1/Device/DeviceEdit', data);
  };

  // 解绑设备
  deviceUnbind (data) {
    return this.post('/yunyoutenant/api/v1/Device/DeviceUnbind', data);
  };

  // 获取设备的参数设置信息
  deviceSetting (data) {
    return this.get('/yunyoutenant/api/v1/Device/DeviceSetting', data);
  };

  // 修改设备的参数设置
  deviceSettingEdit (data) {
    return this.post('/yunyoutenant/api/v1/Device/DeviceSettingEdit', data);
  };

  // 设备绑定
  deviceBind (data) {
    return this.post('/yunyoutenant/api/v1/Device/DeviceBind', data);
  };

  // 设置机台概率
  setProbability (data) {
    return this.put('/yunyoutenant/api/v1/Device/SetProbability', data);
  };

  // 投币测试每次固定10个币
  coinTest (data) {
    return this.post('/yunyoutenant/api/v1/Device/CoinTest', data);
  };

  // 设置设备离线是否通知
  offlineNotification (data) {
    return this.put('/yunyoutenant/api/v1/Device/OfflineNotification', data);
  };

  // 轮询设备绑定结果
  isDeviceBind (data) {
    return this.get('/yunyoutenant/api/v1/Device/IsDeviceBind', data);
  };

  //
  getProbability (data) {
    return this.get('/yunyoutenant/api/v1/Device/GetProbability', data);
  };

  // 获得设备反扫注册码
  registerCode (data) {
    return this.get('/yunyoutenant/api/v1/Device/RegisterCode', data);
  };

  // 设置机台短编号
  setDeviceSn (data) {
    return this.post('/yunyoutenant/api/v1/Device/SetDeviceSn', data);
  };

  getMenuList (data) {
    return this.get('/yunyoutenant/api/v1/Device/GetMenuList', data);
  }

  getMenuListResult (data) {
    return this.get('/yunyoutenant/api/v1/Device/GetMenuListResult', data);
  }

  updateMenuList (data) {
    return this.put('/yunyoutenant/api/v1/Device/UpdateMenu', data);
  }
//{actions}
}

export default new Device();
