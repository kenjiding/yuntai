import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  getters,
  mutations,
  actions,
  state: {
    userInfo: JSON.parse(localStorage.getItem('user-info') || null) || {
      CustomerID: null,
      CustomerName: null,
      TenantID: null,
      TenantName: null,
      TerminalID: null,
      TerminalName: null,
      Token: null,
      UserID: null,
      UserName: null,
      RoleNames: null,
      IsMain: null,
    },
    testData: {
      huxian: '3.5',
      gaodu: '随机',
      zhuali: '35',
      daoding: '24',
      yidong: '18',
      songda: '48',
      qianhou: '5',
      zuoyou: '5',
      shangxia: '5',
    },
    indexTenantID: null,
    openId: sessionStorage.getItem('open-id') || null,
    // 新版首页tab的选中状态，为了实现返回上一页的时候依旧保留选中
    tabActiveIndex: 0,

    linkBackData: null, // 进入新页面的返回数据
    activityRankingData: {},
    // 自定义风格的跳转设置
    customMiniProPreviewThemeData: {},
  },
});
