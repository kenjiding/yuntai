import Base from '@/api/Base';

class Activity extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  atlasList (data) {
    return this.get('/yunyoutenant/api/v1/Atlas/AtlasList', data);
  };

  createAtlas (data) {
    return this.post('/yunyoutenant/api/v1/Atlas/CreateAtlas', data);
  };

  updateFlag (data) {
    return this.get('/yunyoutenant/api/v1/Atlas/UpdateFlag', data);
  };

  deleteAtlas (data) {
    return this.post('/YunyouTenant/api/v1/Atlas/DeleteAtlas', data);
  };

  editAtlas (data) {
    return this.post('/YunyouTenant/api/v1/Atlas/EditAtlas', data);
  };

  atlasDetail (data) {
    return this.get('/yunyoutenant/api/v1/Atlas/AtlasDetail', data);
  };

//{actions}
}

export default new Activity();
