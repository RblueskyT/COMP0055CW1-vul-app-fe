import { createStore } from 'vuex'

export default createStore({
  state: {
    username: "",
    login_method: "accountLogin",
  },
  getters: {
    getUsername (state) {
      return state.username;
    },
    getLoginMethod (state) {
      return state.login_method;
    }
  },
  mutations: {
    changeLoginMethod (state, login_method) {
      state.login_method = login_method;
      localStorage.setItem('login_method', login_method);
    },
    login (state, username) {
      state.username = username;
      localStorage.setItem('username', username);
    },
    logout (state) {
      state.username = "";
      localStorage.removeItem("username");
    },
    initialiseStore(state) {
      if(localStorage.getItem('username')){
        state.username = localStorage.getItem('username');
       }
    }
  },
  actions: {
  },
  modules: {
  }
})
