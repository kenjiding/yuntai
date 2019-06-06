import Base from '@/api/Base';

class Packge extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获取游玩套餐信息
  packgeInfo (data) {
    return this.get('/YunyouTenant/api/v1/Packge/PackgeInfo', data);
  };

  // 新增游玩套餐
  addNewPackge (data) {
    return this.post('/YunyouTenant/api/v1/Packge/AddNewPackge', data);
  };

  // 获取门店列表信息
  getStoreList (data) {
    return this.get('/YunyouTenant/api/v1/Packge/GetStoreList', data);
  };

  batchAddGoods (data) {
    return this.post('/YunyouTenant/api/v1/Packge/BatchAddGoods', data);
  };

  // 通过id获取套餐信息
  getPackgeInfoById (data) {
    return this.get('/YunyouTenant/api/v1/Packge/GetPackgeInfoById', data);
  };

  // 编辑游乐套餐
  editPackge (data) {
    return this.post('/YunyouTenant/api/v1/Packge/EditPackge', data);
  };

  // 删除套票
  deletePackageItem (data) {
    return this.get('/YunyouTenant/api/v1/Packge/DeletePackageItem', data);
  };

  // 通过套票名称获取套票列表
  getPackageListByName (data) {
    return this.get('/YunyouTenant/api/v1/Packge/GetPackageListByName', data);
  };
//{actions}
}

export default new Packge();
