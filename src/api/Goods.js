import Base from '@/api/Base';

class Goods extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取商品l列表
  goodsInfoList (data) {
    return this.get('/YunyouTenant/api/v1/Goods/GoodsInfoList', data);
  };

  // 通过id获取商品信息
  getGoodsInfoById (data) {
    return this.get('/YunyouTenant/api/v1/Goods/GetGoodsInfoById', data);
  };

  // 获取商品分组列表
  getGoodsGroup (data) {
    return this.get('/YunyouTenant/api/v1/Goods/GetGoodsGroup', data);
  };

  // 新增商品信息
  addGoods (data) {
    return this.get('/YunyouTenant/api/v1/Goods/AddGoods', data);
  };

  // 编辑商品
  editGoods (data) {
    return this.get('/YunyouTenant/api/v1/Goods/editGoods', data);
  };
//{actions}
}

export default new Goods();
