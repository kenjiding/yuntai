import Base from '@/api/Base';

class Order extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 根据搜索条件获取订单列表
  getOrderList (data) {
    return this.get('/yunyoutenant/api/v1/Order/GetOrderList', data);
  };

  // 根据订单ID获取订单的订单项信息
  getOrderItemList (data) {
    return this.get('/yunyoutenant/api/v1/Order/GetOrderItemList', data);
  };

  // 订单退货
  returnOrder (data) {
    return this.post('/yunyoutenant/api/v1/Order/ReturnOrder', data);
  };

  // 取消订单
  cancelOrder (data) {
    return this.post('/yunyoutenant/api/v1/Order/CancelOrder', data);
  };

  // 获取订单详情
  getOrderDetail (data) {
    return this.get('/yunyoutenant/api/v1/Order/GetOrderDetail', data);
  };
//{actions}
}

export default new Order();
