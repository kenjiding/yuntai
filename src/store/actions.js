import Account from '@/api/Account';

export default {
  login ({ commit }, data) {
    return Account
      .login(data)
      .then((resData) => {
        // commit('setUserInfo', resData);
        return resData;
      });
  },

  logout ({ commit }) {
    return Account
      .logout()
      .then((res) => {
        commit('setUserInfo', {
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
        });
        return res;
      });
  },

  asyncfetchUserInfo ({ commit }) {
    return Account
      .getLoginInfo()
      .then((data) => {
        commit('setUserInfo', data);
      });
  },
};
