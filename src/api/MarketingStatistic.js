import Base from '@/api/Base';

class MarketingStatistic extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取门店列表
  getTenantList (data) {
    return this.get('/yunyoutenant/api/v1/MarketingStatistic/GetTenantList', data);
  };

  // 获取经营数据统计汇总
  getTenantAnalysis (data) {
    return this.get('/yunyoutenant/api/v1/MarketingStatistic/GetTenantAnalysis', data);
  };

  // 获取经营数据统计明细
  getTenantAnalysisDetail (data) {
    return this.get('/yunyoutenant/api/v1/MarketingStatistic/GetTenantAnalysisDetail', data);
  };

  // 获取设备分析汇总
  getDeviceAnalysis (data) {
    return this.get('/yunyoutenant/api/v1/MarketingStatistic/GetDeviceAnalysis', data);
  };

  // 获取设备分析明细
  getDeviceAnalysisDetail (data) {
    return this.get('/yunyoutenant/api/v1/MarketingStatistic/GetDeviceAnalysisDetail', data);
  };

  // 获取顾客分析数据
  getCustomerAnalysis (data) {
    return this.get('/yunyoutenant/api/v1/MarketingStatistic/GetCustomerAnalysis', data);
  };

  // 获得商品消耗汇总
  getGoodsAnalysis (data) {
    return this.get('/yunyoutenant/api/v1/MarketingStatistic/GetGoodsAnalysis', data);
  }

  getGoodsAnalysisDetail (data) {
    return this.get('/yunyoutenant/api/v1/MarketingStatistic/GetGoodsAnalysisDetail', data);
  }

  // 获得收银员数据汇总
  getCashierAnalysis (data) {
    return this.get('/yunyoutenant/api/v1/MarketingStatistic/GetCashierAnalysis', data);
  }

  // 获取收银员数据明细
  getCashierAnalysisDetail (data) {
    return this.get('/yunyoutenant/api/v1/MarketingStatistic/GetCashierAnalysisDetail', data);
  }
//{actions}
}

export default new MarketingStatistic();
