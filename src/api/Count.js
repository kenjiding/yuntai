import Base from '@/api/Base';

class Count extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 首页获取统计数据
  getCountInfo (data) {
    return this.get('/YunyouTenant/api/v1/Count/GetCountInfo', data);
  };
//{actions}
}

export default new Count();
