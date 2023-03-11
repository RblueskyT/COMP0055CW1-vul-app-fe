import { createStore } from 'vuex'

export default createStore({
  state: {
    username: "",
    usertoken: "",
    login_method: "accountLogin",
  },
  getters: {
    getUsername (state) {
      return state.username;
    },
    getLoginMethod (state) {
      return state.login_method;
    },
    getUserToken (state) {
      return state.usertoken;
    }
  },
  mutations: {
    changeLoginMethod (state, login_method) {
      state.login_method = login_method;
      localStorage.setItem('login_method', login_method);
    },
    login (state, payload) {
      state.username = payload.username;
      state.usertoken = payload.usertoken;
      localStorage.setItem('username', payload.username);
      localStorage.setItem('usertoken', payload.usertoken);
    },
    logout (state) {
      state.username = "";
      state.usertoken = "";
      localStorage.removeItem("username");
      localStorage.removeItem("usertoken");
    },
    initialiseStore(state) {
      if(localStorage.getItem('username')){
        state.username = localStorage.getItem('username');
       }
       if (localStorage.getItem('usertoken')) {
        state.usertoken = localStorage.getItem('usertoken');
      }
      if (localStorage.getItem('login_method')) {
        state.login_method = localStorage.getItem('login_method');
      }
    }
  },
  actions: {
    userLogin: ({commit}, payload) => {
      commit('login', payload);
    }
  },
  modules: {
  }
})
