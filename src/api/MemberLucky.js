import Base from '@/api/Base';

class MemberLucky extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 开启设备的会员概率参与功能
  open (data) {
    return this.put('/YunyouTenant/api/v1/LeagugerLucky/Open', data);
  }

  // 获取主体下的会员概率设备列表（全部）
  list (data) {
    return this.get('/YunyouTenant/api/v1/LeagugerLucky/List', data);
  }

  // 关闭设备的会员概率参与功能
  close (data) {
    return this.put('/YunyouTenant/api/v1/LeagugerLucky/Close', data);
  }

  // 更新会员概率开关
  update (data) {
    return this.post('/YunyouTenant/api/v1/LeagugerLucky/Update', data);
  }

  // 查询会员的幸运值
  balance (data) {
    return this.get('/YunyouTenant/api/v1/LeagugerLucky/Balance', data);
  }

  // 设置机台中奖概率
  setProbability (data) {
    return this.post('/YunyouTenant/api/v1/LeagugerLucky/SetProbability', data);
  }

  // 获取概率设置
  getRateSetting (data) {
    return this.post('/YunyouTenant/api/v1/LeagugerLucky/GetRateSetting', data);
  }

  // 保存概率设置
  saveRateSetting (data) {
    return this.post('/YunyouTenant/api/v1/LeagugerLucky/SaveRateSetting', data);
  }
}

export default new MemberLucky();
