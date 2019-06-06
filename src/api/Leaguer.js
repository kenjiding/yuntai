import Base from '@/api/Base';

class Leaguer extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 会员首页统计数据
  tenantCount (data) {
    return this.get('/yunyoutenant/api/v1/Leaguer/TenantCount', data);
  };

  // 获得会员等级
  leaguerLevel (data) {
    return this.get('/yunyoutenant/api/v1/Leaguer/LeaguerLevel', data);
  };

  // 会员列表
  leaguerList (data) {
    return this.get('/yunyoutenant/api/v1/Leaguer/LeaguerList', data);
  };

  // 会员首页统计数据
  leaguerCount (data) {
    return this.get('/yunyoutenant/api/v1/Leaguer/LeaguerCount', data);
  };

  // 获得门店列表
  tenantList (data) {
    return this.get('/yunyoutenant/api/v1/Leaguer/TenantList', data);
  };

  // 新建会员等级
  leaguerLevelCreate (data) {
    return this.post('/yunyoutenant/api/v1/Leaguer/LeaguerLevelCreate', data);
  };

  // 修改会员等级
  leaguerLevelEdit (data) {
    return this.post('/yunyoutenant/api/v1/Leaguer/LeaguerLevelEdit', data);
  };

  // 获得等级详细信息
  leaguerLevelDetail (data) {
    return this.get('/yunyoutenant/api/v1/Leaguer/LeaguerLevelDetail', data);
  };

  // 获得会员详细信息
  leaguerDetail (data) {
    return this.get('/yunyoutenant/api/v1/Leaguer/LeaguerDetail', data);
  };

  // 获得会员消费记录
  consumptionRecord (data) {
    return this.get('/yunyoutenant/api/v1/Leaguer/ConsumptionRecord', data);
  };

  // 获得会员兑换记录
  exchangeRecord (data) {
    return this.get('/yunyoutenant/api/v1/Leaguer/ExchangeRecord', data);
  };

  // 获得会员启动记录
  startRecord (data) {
    return this.get('/yunyoutenant/api/v1/Leaguer/StartRecord', data);
  };
//{actions}
}

export default new Leaguer();
