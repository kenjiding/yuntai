export default {
  getToken (state) {
    return (state.userInfo && state.userInfo.Token) || null;
  },

  getIsAdmin (state) {
    return state.userInfo.RoleNames[0] === 'Admin';
  },

  getPremissions (state) {
    if (!state.userInfo) return [];

    if (!state.userInfo.RoleNames) {
      return [];
    }
    if (state.userInfo.RoleNames[0] === 'Admin') {
      return [
        'order',
        'customer-appeal',
        'device-register',
        'tenant-list',
        'goods',
        'goods-edit',
        'goods-sale',
        'package',
        'package-edit',
        'package-sale',
        'leaguer',
        'activity',
        'gift-management',
        'marketing-statistic',
        'points-mall',
        'buy-gift',
      ];
    } else if (state.userInfo.RoleNames[0] === 'Manager') {
      return [
        'order',
        'customer-appeal',
        'device-register',
        'tenant-list',
        'goods',
        'goods-sale',
        'package',
        'package-sale',
        'leaguer',
        'activity',
        'gift-management',
        'marketing-statistic',
        // 'points-mall',
        'buy-gift',
      ];
    } else if (state.userInfo.RoleNames[0] === 'Partner') {
      return [
        // 'customer-appeal',
        'marketing-statistic',
      ];
    } else if (state.userInfo.RoleNames[0] === 'Employee') {
      return [
        // 'order',
        'customer-appeal',
        'gift-management',
      ];
    } else {
      return [];
    }
  },
};
