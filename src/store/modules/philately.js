export default {
  namespaced: true,
  state: {
    philatelyData: {},
  },
  actions: {},
  getters: {},
  mutations: {
    savePhilatelyData (state, data) {
      state.philatelyData = data;
    },
  },
};
