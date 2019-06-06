import Base from '@/api/Base';

class GiftManagement extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取门店列表
  getTenantList (data) {
    return this.get('/YunyouTenant/api/v1/GiftManagement/GetTenantList', data);
  };

  // 根据门店获取机台列表
  getGiftDeviceList (data) {
    return this.post('/YunyouTenant/api/v1/GiftManagement/GetGiftDeviceList', data);
  };

  // 获取设备的礼品设置
  getGiftSettingByDevice (data) {
    return this.get('/YunyouTenant/api/v1/GiftManagement/GetGiftSettingByDevice', data);
  };

  // 修改礼品设置
  editGiftSetting (data) {
    return this.post('/yunyoutenant/api/v1/GiftManagement/EditGiftSetting', data);
  };

  // 获取礼品列表
  getGiftListFromGoods (data) {
    return this.get('/yunyoutenant/api/v1/GiftManagement/GetGiftListFromGoods', data);
  };

  // 清空礼品
  clearDiftData (data) {
    return this.get('/yunyoutenant/api/v1/GiftManagement/ClearDiftData', data, {
      ignoreErrCode: ['202100031'],
    });
  };
//{actions}
}

export default new GiftManagement();
