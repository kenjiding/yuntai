import Base from '@/api/Base';

class GetCash extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取提现时的详细信息
  getCashInfo (data) {
    return this.get('/YunyouTenant/api/v1/GetCash/GetCashInfo', data);
  };

  // 获取用户提现记录
  getCashLog (data) {
    return this.get('/YunyouTenant/api/v1/GetCash/GetCashLog', data);
  };

  // 提交提取现金的申请
  postCashApplication (data) {
    return this.get('/YunyouTenant/api/v1/GetCash/PostCashApplication', data);
  };

  // 用户绑定银行卡
  getBankCartInfo (data) {
    return this.post('/YunyouTenant/api/v1/GetCash/GetBankCartInfo', data);
  };
//{actions}
}

export default new GetCash();
