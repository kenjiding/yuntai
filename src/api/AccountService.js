import Base from './Base';

class AccountService extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获得分组商品
  GetSaleGoods (data) {
    return this.get('/POS/api/v1/Goods/GetSaleGoods', data);
  }

  Logout (data) {
    return this.post('/Identity/api/V1/Account/Logout', data);
  }
}

export default new AccountService();
