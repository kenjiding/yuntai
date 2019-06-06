import Base from '@/api/Base';

class Activity extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 获得活动赠送列表
  activityList (data) {
    return this.get('/yunyoutenant/api/v1/Activity/ActivityList', data);
  };

  // 获得完善资料送币设置
  activityCompletedInfo (data) {
    return this.get('/yunyoutenant/api/v1/Activity/ActivityCompletedInfo', data);
  };

  // 活动详细信息
  activityDetail (data) {
    return this.get('/yunyoutenant/api/v1/Activity/ActivityDetail', data);
  };

  // 新增活动
  activityCreate (data) {
    return this.post('/yunyoutenant/api/v1/Activity/ActivityCreate', data);
  };

  // 修改活动信息
  activityEdit (data) {
    return this.post('/yunyoutenant/api/v1/Activity/ActivityEdit', data);
  };

  // 修改完善资料赠币设置
  activityCompletedInfoEdit (data) {
    return this.post('/yunyoutenant/api/v1/Activity/ActivityCompletedInfoEdit', data);
  };
//{actions}
}

export default new Activity();
