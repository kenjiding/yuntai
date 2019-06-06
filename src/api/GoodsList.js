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

  goodsInfoListForAtlas (data) {
    return this.get('/YunyouTenant/api/v1/Goods/GoodsInfoListForAtlas', data);
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
    return this.post('/YunyouTenant/api/v1/Goods/AddGoods', data);
  };

  batchAddGoods (data) {
    return this.post('/YunyouTenant/api/v1/Goods/BatchAddGoods', data);
  };

  editGoodsGroup (data) {
    return this.post('/YunyouTenant/api/v1/Goods/EditGoodsGroup', data);
  };

  deletedGoodsGroup (data) {
    return this.post('/YunyouTenant/api/v1/Goods/DeletedGoodsGroup', data);
  };

  // 编辑商品
  editGoods (data) {
    return this.post('/YunyouTenant/api/v1/Goods/EditGoods', data);
  };

  // 添加商品分组
  addGoodsGroup (data) {
    return this.get('/YunyouTenant/api/v1/Goods/AddGoodsGroup', data);
  };

  // 删除商品信息
  deleteGoodsItem (data) {
    return this.get('/YunyouTenant/api/v1/Goods/DeleteGoodsItem', data);
  };

  // 根据商品名称获取商品列表
  getGoodsInfoByName (data) {
    return this.get('/YunyouTenant/api/v1/Goods/GetGoodsInfoByName', data);
  };
//{actions}
}

export default new Goods();
