import Base from '@/api/Base';

class RechargeGift extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获得活动列表
  activityList (data) {
    return this.get('/yunyoutenant/api/v1/RechargeGift/ActivityList', data);
  };

  // 新建充值送商品活动
  create (data) {
    return this.post('/yunyoutenant/api/v1/RechargeGift/Create', data);
  };

  // 提前关闭充值送商品活动
  close (data) {
    return this.post('/yunyoutenant/api/v1/RechargeGift/Close', data);
  };

  // 活动领取记录
  receiveRecord (data) {
    return this.get('/yunyoutenant/api/v1/RechargeGift/ReceiveRecord', data);
  };

  // 获得游戏币套餐列表
  coinList (data) {
    return this.get('/yunyoutenant/api/v1/RechargeGift/CoinList', data);
  };

  // 添加奖品
  createGift (data) {
    return this.get('/yunyoutenant/api/v1/RechargeGift/CreateGift', data);
  };

  //
  goodsList (data) {
    return this.get('/yunyoutenant/api/v1/RechargeGift/GoodsList', data);
  };

  //
  writeOffInfo (data) {
    return this.get('/yunyoutenant/api/v1/RechargeGift/WriteOffInfo', data);
  };

  // 中奖核销
  writeOff (data) {
    return this.post('/yunyoutenant/api/v1/RechargeGift/WriteOff', data);
  };

  // 获得活动具体内容
  activityInfo (data) {
    return this.get('/yunyoutenant/api/v1/RechargeGift/ActivityInfo', data);
  };

  // 修改活动
  edit (data) {
    return this.post('/yunyoutenant/api/v1/RechargeGift/Edit', data);
  }
//{actions}
}

export default new RechargeGift();
