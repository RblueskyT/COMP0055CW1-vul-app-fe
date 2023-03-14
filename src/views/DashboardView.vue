<template>
    <div class="dashboard">
      <h1>Dashboard</h1>
      <h1 style="color: green">Welcome, {{ createStore.getters.getUsername }}!</h1>
      <div><button type="button" @click="userLogout">Log Out</button></div>
      <div v-if="createStore.getters.getLoginMethod == 'twitterLoginSF'">
        <h1>Tweet</h1>
      <input style="margin-right: 5px;" placeholder="Enter your tweet here ..." v-model="tweetText" /><button @click="postANewTweet()" >Tweet</button>
      </div>
      <!-- <h2>Current Balance:</h2>
      <h2>{{ userBalance }}</h2>
      <h2>Balance Records:</h2>
      <table>
        <tr>
          <th>Index</th>
          <th>Balance Change</th>
          <th>Change Reason</th>
          <th>Change Date</th>
        </tr>
        <tr v-for="(item, index) in userBalanceRecords" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.balance_change }}</td>
          <td>{{ item.change_reason }}</td>
          <td>{{ item.change_date }}</td>
        </tr>
      </table><br/>
      <form>
      <label for="dst_username">Destination Username:</label><br>
      <input type="text" id="dst_username" name="dst_username" v-model="accountTransferForm.dst_username"><br>
      <label for="amount">Amount:</label><br>
      <input type="number" id="amount" name="amount" v-model="accountTransferForm.amount" min="1" max="10"><br>
      <label for="reason">Reason:</label><br>
      <input type="text" id="reason" name="reason" v-model="accountTransferForm.reason"><br><br>
      <button type="button" @click="accountTransfer">Account Transfer</button>
      </form><br>
      <div><button type="button" @click="getUserBalanceAndBalanceRecords(createStore.getters.getUsername)">Refresh Balance</button></div><br> -->
      <h2>Posts:</h2>
      <h6>--------------------------------------------------------------------</h6>
      <div v-for="(item, index) in posts" :key="index">
        <h3>{{ item.post_title }}</h3>
        <div v-html="item.post_content"></div>
        <h6>--------------------------------------------------------------------</h6>
      </div>
      <form>
      <label for="post_title">Post Title:</label><br>
      <input type="text" id="post_title" name="post_title" v-model="postForm.post_title"><br>
      <label for="post_content">Post Content:</label><br>
      <input type="text" id="post_content" name="post_content" v-model="postForm.post_content"><br><br>
      <button type="button" @click="addPost">Add Post</button>
      </form><br>
      <div><button type="button" @click="getAllPosts(createStore.getters.getUsername)">Refresh Posts</button></div><br>
    </div>
  </template>
  
  <script>
    import {  defineComponent, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import createStore from "@/store";
    import axios from 'axios';
    
    export default defineComponent({
    setup() {
        const router = useRouter();
        const tweetText = ref('');
        const userBalance = ref(0);
        const userBalanceRecords = ref([]);
        const posts = ref([]);
        const accountTransferForm = ref({
          src_username: createStore.getters.getUsername,
          dst_username: '',
          amount: 1,
          reason: '',
        });
        const postForm = ref({
          username: createStore.getters.getUsername,
          post_title: '',
          post_content: '',
        })

    const postANewTweet = async () => {
      if(tweetText.value.length > 0){
        console.log(createStore.state);
            const resData = await axios.post('http://localhost:8000/dashboard/tweet', { username: createStore.getters.getUsername, text: tweetText.value, token: createStore.getters.getUserToken });
            alert(resData.data);
            }else{
                alert('you can not post an empty tweet')
            }
    }

    const getUserBalanceAndBalanceRecords = async (username) => {
      try {
        const balanceData = await axios.post('http://localhost:8000/dashboard/get_user_balance', { username: username });
        if (balanceData.data.code == 200) {
          userBalance.value = balanceData.data.balance;
        }
        const balanceRecordsData = await axios.post('http://localhost:8000/dashboard/get_user_balance_records', { username: username });
        if (balanceRecordsData.data.code == 200) {
          userBalanceRecords.value.splice(0, userBalanceRecords.value.length);
          userBalanceRecords.value = userBalanceRecords.value.concat(balanceRecordsData.data.balance_records);
        }
      } catch (error) {
        alert('Unknown Error Occurs');
      } finally {
        // Empty here
      }
    }

    const getAllPosts = async (username) => {
      try {
        const postData = await axios.post('http://localhost:8000/dashboard/get_posts', { username: username });
        if (postData.data.code == 200) {
          posts.value.splice(0, posts.value.length);
          posts.value = posts.value.concat(postData.data.posts);
        }
      } catch (error) {
        alert('Unknown Error Occurs');
      } finally {
        // Empty here
      }
    }

    const accountTransfer = async () => {
      try {
        const transferRes = await axios.post('http://localhost:8000/dashboard/account_transfer', accountTransferForm.value);
        if (transferRes.data.code == 200) {
          alert('Transfer Succeeded');
          getUserBalanceAndBalanceRecords(createStore.getters.getUsername);
          getAllPosts(createStore.getters.getUsername);
        } else {
          alert('Unknown Error Occurred');
        }
      } catch (error) {
        alert('Unknown Error Occurs');
      } finally {
        // Empty here
      }
    }

    const addPost = async () => {
      try {
        const addPostRes = await axios.post('http://localhost:8000/dashboard/add_post', postForm.value);
        if (addPostRes.data.code == 200) {
          alert('Post Creation Succeeded');
          getUserBalanceAndBalanceRecords(createStore.getters.getUsername);
          getAllPosts(createStore.getters.getUsername);
        } else {
          alert('Unknown Error Occurred');
        }
      } catch (error) {
        alert('Unknown Error Occurs');
      } finally {
        // Empty here
      }
    }

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
            if (resData.data.code == 403) {
                router.push({
                    name: 'login',
                });
                alert("Please log in first");
            } else {
              getUserBalanceAndBalanceRecords(username);
              getAllPosts(username);
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
        const resData = await axios.post('http://localhost:8000/login/user_logout', { username: createStore.getters.getUsername });
        if (resData.status === 200) {
            createStore.commit('logout');
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
        createStore,
        tweetText,
        userBalance,
        userBalanceRecords,
        posts,
        accountTransferForm,
        postForm,
        postANewTweet,
        getUserBalanceAndBalanceRecords,
        getAllPosts,
        accountTransfer,
        addPost,
        userLogout,
    }
  },
  });
  </script>
  
  <style>
  table {
    width: 100%;
  }

  td, th {
    border: 1px solid #1b1b1b;
    text-align: left;
    padding: 8px;
  }
  </style>