import { createStore } from 'vuex'

export default createStore({
  state: {
    username: "",
  },
  getters: {
    getUsername (state) {
      return state.username;
    }
  },
  mutations: {
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
