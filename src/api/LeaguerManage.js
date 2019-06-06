import Base from '@/api/Base';

class LeaguerManage extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取会员统计信息
  getLeaguerStatistics (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/GetLeaguerStatistics', data);
  };

  updateLevelFlag (data) {
    return this.post('/yunyoutenant/api/v1/LeaguerManage/UpdateLevelFlag', data);
  };

  postLevelSetting (data) {
    return this.post('/yunyoutenant/api/v1/LeaguerManage/PostLevelSetting', data);
  };

  currencyRecord (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/CurrencyRecord', data);
  };

  integralRecord (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/IntegralRecord', data);
  };

  getLevelSettingData (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/GetLevelSettingData', data);
  };

  getLevelList (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/GetLevelList', data);
  };

  // 获取消费排行
  consumptionRanking (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/ConsumptionRanking', data);
  };

  // 获取会员信息，根据最近消费时间倒序排序
  consumptionRankingByTime (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/ConsumptionRankingByTime', data);
  };

  // 获取会员统计信息，基本信息，消费总数，游戏币余额，积分余额
  getLeaguerCensusInfo (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/GetLeaguerCensusInfo', data);
  };

  // 获取会员消费记录
  getLeaguerConsums (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/GetLeaguerConsums', data);
  };

  // 获取会员兑换记录
  getLeaguerConvertRecord (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/GetLeaguerConvertRecord', data);
  };

  // 获取会员启动记录
  getDeviceInitRecords (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/GetDeviceInitRecords', data);
  };

  // 获取会员中奖记录
  getWinningRecords (data) {
    return this.get('/yunyoutenant/api/v1/LeaguerManage/GetWinningRecords', data);
  };
//{actions}
}

export default new LeaguerManage();
