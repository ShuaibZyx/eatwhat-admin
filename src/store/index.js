import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //是否折叠左菜单栏
    isCollapse: false,
    admin: JSON.parse(window.sessionStorage.getItem("admin")),
  },
  getters: {},
  mutations: {
    //设置是否折叠左菜单栏
    SetIsCollapse(state, value) {
      state.isCollapse = value;
    },
    //设置当前管理员
    SetAdmin(state, value) {
      state.admin = value;
    },
  },
  actions: {},
  modules: {},
});
