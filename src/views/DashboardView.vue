<template>
    <div class="dashboard">
      <h1>Dashboard</h1>
      <h1 style="color: green">Welcome, {{ createStore.getters.getUsername }}!</h1>
      <h2>Current Balance:</h2>
      <h2>{{ userBalance }}</h2>
      <h2>Balance Records:</h2>
      <table>
        <tr>
          <th>Index</th>
          <th>Balance Change</th>
          <th>Change Reason</th>
          <th>Change Date</th>
        </tr>
        <tr v-for="(item, index) in userBalanceRecord" :key="index">
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
      <div><button type="button" @click="getUserBalanceAndBalanceRecords(createStore.getters.getUsername)">Refresh Balance</button></div><br>
      <div><button type="button" @click="userLogout">Log Out</button></div>
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
        const userBalance = ref(0);
        const userBalanceRecord = ref([]);
        const accountTransferForm = ref({
          src_username: createStore.getters.getUsername,
          dst_username: '',
          amount: 1,
          reason: '',
        });

    const getUserBalanceAndBalanceRecords = async (username) => {
      try {
        const balanceData = await axios.post('http://localhost:8000/dashboard/get_user_balance', { username: username });
        if (balanceData.data.code == 200) {
          userBalance.value = balanceData.data.balance;
        }
        const balanceRecordsData = await axios.post('http://localhost:8000/dashboard/get_user_balance_records', { username: username });
        if (balanceRecordsData.data.code == 200) {
          userBalanceRecord.value.splice(0, userBalanceRecord.value.length);
          userBalanceRecord.value = userBalanceRecord.value.concat(balanceRecordsData.data.balance_records);
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
        createStore,
        userBalance,
        userBalanceRecord,
        accountTransferForm,
        getUserBalanceAndBalanceRecords,
        accountTransfer,
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