import Base from '@/api/Base';

class Account extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  getRankingList (data) {
    return this.get('/YunyouTenant/api/v1/ActivityRanking/GetRankingList', data);
  };

  closeActivity (data) {
    return this.post('/YunyouTenant/api/v1/ActivityRanking/CloseActivity', data);
  };

  GetRankingSort (data) {
    return this.get('/YunyouTenant/api/v1/ActivityRanking/GetRankingSort', data);
  };

  postQrCodeInfo (data) {
    return this.post('/YunyouTenant/api/v1/ActivityRanking/PostQrCodeInfo', data);
  };

  getGoodsLists (data) {
    return this.get('/YunyouTenant/api/v1/ActivityRanking/GetGoodsLists', data);
  };

  editActivityRanking (data) {
    return this.post('/YunyouTenant/api/v1/ActivityRanking/EditActivityRanking', data);
  };

  addActivityRanking (data) {
    return this.post('/YunyouTenant/api/v1/ActivityRanking/AddActivityRanking', data);
  };

  getActivityInfoByID (data) {
    return this.get('/YunyouTenant/api/v1/ActivityRanking/GetActivityInfoByID', data);
  };
//{actions}
}

export default new Account();
