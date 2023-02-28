<template>
    <div class="dashboard">
      <h1 style="text-align: center;">User Dashboard</h1>
      <div style="text-align: center;"><button type="button" @click="userLogout">Log Out</button></div>
    </div>
  </template>
  
  <script>
    import {  defineComponent } from 'vue';
    import { useRouter } from 'vue-router';
    import createStore from "@/store";
    import axios from 'axios';
    
    export default defineComponent({
    setup() {
        const router = useRouter();

    const checkUserStatus = async () => {
      const username = createStore.getters.getUsername;
      try {
        if (username.length <= 0) {
            router.push({
              name: 'login',
            });
            alert("Please log in first");
        } else {
            const resData = await axios.post('http://localhost:8000/login/check_user_status', { username: username });
            if (resData.code == 403) {
                router.push({
                    name: 'login',
                });
                alert("Please log in first");
            }
        }
      } catch (error) {
        alert('Unknown Error Occurs');
      } finally {
        // Empty here
      }
    };
    const userLogout = async () => {
      try {
        const resData = await axios.get('http://localhost:8000/login/user_logout');
        if (resData.status === 200) {
            createStore.commit('logout')
            router.push({
              name: 'login',
            });
            alert('You successfully logged out');
        } else {
          alert('Unknown Error Occurs');
        }
      } catch (error) {
        alert('Unknown Error Occurs');
      } finally {
        // Empty here
      }
    };

    checkUserStatus();
  
    return {
        userLogout,
    }
  },
  });
  </script>
  
  <style></style>