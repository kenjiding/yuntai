
export default {
  setUserInfo (state, info) {
    // info = delete info.MerchantList;
    document.title = info.CustomerName || '芸苔新零售';

    let userInfo = Object.assign(state.userInfo || {}, info);
    localStorage.setItem('user-info', JSON.stringify(userInfo));
  },

  clearUserInfo (state) {
    Object.assign(state.userInfo, {
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
    });
    localStorage.removeItem('user-info');
  },

  setOpenId (state, openId = null) {
    state.openId = openId;
    sessionStorage.setItem('open-id', openId);
  },

  changeFirstLoad (state, value) {
    state.isFirstLoad = value;
  },

  changeTenantID (state, value) {
    state.indexTenantID = value;
  },

  changeTest (state, data) {
    state.testData = data;
  },

  changeTabActive (state, data) {
    state.tabActiveIndex = data;
  },

  setLinkBackData (state, data) {
    state.linkBackData = data;
  },

  saveActivityRankingData (state, data) {
    state.activityRankingData = data;
  },

  changeCustomMiniProPreviewThemeData (state, data) {
    state.customMiniProPreviewThemeData = data;
  },
};
