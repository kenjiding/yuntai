import Base from '@/api/Base';

class Promotion extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取活动促销首页信息
  getActivityPromotionInfoAsync (data) {
    return this.get('/YunyouTenant/api/v1/Promotion/GetActivityPromotionInfoAsync', data);
  };

  getSaasURL (data) {
    return this.get('/YunyouTenant/api/v1/Promotion/GetSaasURL', data);
  };

  goTointegralMall (data, url) {
    return this.get(url, data);
  }

  // 获取游戏币红包促销信息
  getGameCurrenceInfoAsync (data) {
    return this.get('/YunyouTenant/api/v1/Promotion/GetGameCurrenceInfoAsync', data);
  };

  // 获取游戏币红包领取记录
  getGameCurrenceInfoLogAsync (data) {
    return this.get('/YunyouTenant/api/v1/Promotion/GetGameCurrenceInfoLogAsync', data);
  };

  // 新增活动红包
  addRedPacketsAsync (data) {
    return this.post('/YunyouTenant/api/v1/Promotion/AddRedPacketsAsync', data);
  };

  // 获取游戏币红包领取记录列表
  getGameCurrenceLogListAsync (data) {
    return this.get('/YunyouTenant/api/v1/Promotion/GetGameCurrenceLogListAsync', data);
  };
//{actions}
}

export default new Promotion();
