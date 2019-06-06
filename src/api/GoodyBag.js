import Base from '@/api/Base';

class GoodyBag extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取福袋活动列表
  activityList (data) {
    return this.get('/yunyoutenant/api/v1/GoodyBag/ActivityList', data);
  };

  // 新建活动
  itemCreate (data) {
    return this.post('/yunyoutenant/api/v1/GoodyBag/ItemCreate', data);
  };

  // 新建现金红包活动
  cashCreate (data) {
    return this.post('/yunyoutenant/api/v1/GoodyBag/CashCreate', data);
  };

  // 获得兑奖核销时的中奖信息
  winingInfo (data) {
    return this.get('/yunyoutenant/api/v1/GoodyBag/WiningInfo', data);
  };

  // 中奖核销
  writeOff (data) {
    return this.post('/yunyoutenant/api/v1/GoodyBag/WriteOff', data);
  };

  // 获取中奖订单列表
  winningList (data) {
    return this.get('/yunyoutenant/api/v1/GoodyBag/WinningList', data);
  };

  // 订单发货
  orderDelivery (data) {
    return this.post('/yunyoutenant/api/v1/GoodyBag/OrderDelivery', data);
  };

  // 中奖订单搜索
  orderSearch (data) {
    return this.get('/yunyoutenant/api/v1/GoodyBag/OrderSearch', data);
  };

  // 获得实物活动的具体信息
  itemDetail (data) {
    return this.get('/yunyoutenant/api/v1/GoodyBag/ItemDetail', data);
  };

  // 获得红包活动的具体信息
  cashDetail (data) {
    return this.get('/yunyoutenant/api/v1/GoodyBag/CashDetail', data);
  };

  // 修改实物活动
  itemUpdate (data) {
    return this.post('/yunyoutenant/api/v1/GoodyBag/ItemUpdate', data);
  };

  // 修改红包活动
  cashUpdate (data) {
    return this.post('/yunyoutenant/api/v1/GoodyBag/CashUpdate', data);
  };

  // 取消活动
  cancel (data) {
    return this.post('/yunyoutenant/api/v1/GoodyBag/Cancel', data);
  };

  // 生成二维码
  generateCode (data) {
    return this.post('/yunyoutenant/api/v1/GoodyBag/GenerateCode', data);
  };

  // 购买充值套餐
  pay (data) {
    return this.post('/yunyoutenant/api/v1/GoodyBag/Pay', data);
  };

  // 查询充值套餐订单接口状态
  payResult (data) {
    return this.get('/yunyoutenant/api/v1/GoodyBag/PayResult', data);
  };

  winningWaitingCount (data) {
    return this.get('/yunyoutenant/api/v1/GoodyBag/WinningWaitingCount', data);
  };

  consumeInfo (data) {
    return this.get('/yunyoutenant/api/v1/GoodyBag/ConsumeInfo', data);
  };

  consumeList (data) {
    return this.get('/yunyoutenant/api/v1/GoodyBag/ConsumeList', data);
  };

  // 获得游戏币红包活动的具体信息
  currencyDetail (data) {
    return this.get('/yunyoutenant/api/v1/GoodyBag/CurrencyDetail', data);
  };

  // 新建游戏币红包活动
  currencyCreate (data) {
    return this.post('/yunyoutenant/api/v1/GoodyBag/CurrencyCreate', data);
  };

  // 修改游戏币红包活动
  currencyUpdate (data) {
    return this.post('/yunyoutenant/api/v1/GoodyBag/CurrencyUpdate', data);
  };
//{actions}
}

export default new GoodyBag();
