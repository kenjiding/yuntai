import Base from '@/api/Base';

class CurrencyRush extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取所有游戏币抢购活动
  list (data) {
    return this.get('/yunyoutenant/api/v1/CurrencyRush/List', data);
  };

  // 新建游戏币抢购活动
  create (data) {
    return this.post('/yunyoutenant/api/v1/CurrencyRush/Create', data);
  };

  // 修改游戏币抢购活动
  edit (data) {
    return this.post('/yunyoutenant/api/v1/CurrencyRush/Edit', data);
  };

  // 游戏币抢购活动详情
  detail (data) {
    return this.get('/yunyoutenant/api/v1/CurrencyRush/Detail', data);
  };

  // 提前结束游戏币抢购活动
  cancel (data) {
    return this.post('/yunyoutenant/api/v1/CurrencyRush/Cancel', data);
  };

  // 获得活动二维码
  qr (data) {
    return this.get('/yunyoutenant/api/v1/CurrencyRush/Qr', data);
  };

  // 游戏币抢购参与记录
  partList (data) {
    return this.get('/yunyoutenant/api/v1/CurrencyRush/PartList', data);
  };
}

export default new CurrencyRush();
