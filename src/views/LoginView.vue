<template>
  <div class="login" style="text-align: center;">
    <h1>Vulnerable App User Login</h1>
    <!-- <form>
      <label for="username">Username:</label><br>
      <input type="text" id="username" name="username" v-model="account_login_form.username"><br>
      <label for="password">Password:</label><br>
      <input type="password" id="password" name="password" v-model="account_login_form.password"><br><br>
      <button type="button" @click="accountLogin">Log In</button>
    </form>
    <p>or</p> -->
    <br>
    <button type="button" @click="startGithubLogin('githubLoginSF')">
        <span>Log In with GitHub </span>
    </button>
    <p>or</p>
    <button type="button" @click="startTwitterLogin('twitterLoginSF')">
        <span>Log In with Twitter </span>
    </button>
    <!-- <p>or</p>
    <button type="button" @click="startGithubLogin('githubLoginCF')">
        <span>Log In with GitHub (Client-Flow)</span>
    </button> -->
    <p>or</p>
    <button type="button" @click="startDropboxLogin('DropboxSF')">
        <span>Log In with Dropbox </span>
    </button>
  </div>
</template>

<script>
  import {  defineComponent,ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import createStore from "@/store";
  import axios from 'axios';
  
  export default defineComponent({
  setup() {
  const route = useRoute();
  const router = useRouter();
  /* Constants used for account login */
  const account_login_form = ref({username: '', password: ''});
  /* Constants used for github OAuth login - client flow */
  const gcfc_id = 'd83ac1ef7822f3087e4b';
  const gcfr_uri = 'http://localhost:8080/login';
  const gcf_scope = 'user';
  const gcf_request_link = `https://github.com/login/oauth/authorize?client_id=${gcfc_id}&redirect_uri=${gcfr_uri}&scope=${gcf_scope}`;
  /* Constants used for github OAuth login - server flow */
  const gsfc_id = ref('');
  const gsfr_uri = ref('');
  const gsf_scope = ref('');

  // Store the user's last login method
  const changeLoginMethod = (newLoginMethod) => {
    createStore.commit('changeLoginMethod', newLoginMethod);
  }

  // Account login
  const accountLogin = async () => {
    try {
        changeLoginMethod('accountLogin');
        const resData = await axios.post('http://localhost:8000/login/account_login', account_login_form.value);
        if (resData.data.code === 200) {
            const payload = { username: account_login_form.value.username, usertoken: '' };
            createStore.dispatch('userLogin', payload);
            router.push({
              name: 'dashboard',
            });
            console.log('You successfully logged in');
          } else {
            alert("Authentication Failed");
          }
      } catch (error) {
        alert('Unknown Error Occurs');
      } finally {
        // Empty here
      }
  }

  // Start github login
  const startGithubLogin = async (flowType) => {
    changeLoginMethod(flowType);
    try {
      if (flowType == 'githubLoginCF') {
        window.location.href = gcf_request_link;
      } else {
          const requiredInfo = await axios.get('http://localhost:8000/login/github_server_flow_info');
          if (requiredInfo.data.code == 200) {
            gsfc_id.value = requiredInfo.data.client_id;
            gsfr_uri.value = requiredInfo.data.redirect_uri;
            gsf_scope.value = requiredInfo.data.scope;
            const gsf_request_link = `https://github.com/login/oauth/authorize?client_id=${gsfc_id.value}&redirect_uri=${gsfr_uri.value}&scope=${gsf_scope.value}`;
            window.location.href = gsf_request_link;
          } else {
            alert('Unknown Error Occurs');
          }
      }
    } catch (error) {
                alert('Unknown Error Occurs');
    } finally {
        // Empty here
    }
  }

  // Github login - redeem access token and login
  const githubRedeemAccessTokenAndLogin = async () => {
            try {
                /* Github Client Flow */
                if (route.query.login_method == 'githubLoginCF') {
                    const resData = await axios.post('http://localhost:8000/login/github_client_flow_redeem', { code: route.query.code });
                    if (resData.data.github_response.includes('bad_verification_code')) {
                        router.push({
                        name: 'login',
                        });
                        alert("Bad Verification Code");
                    } else {
                        const access_token = resData.data.github_response.split('&')[0].split('=')[1];
                        const loginRes = await axios.post('http://localhost:8000/login/github_client_flow_login', {access_token: access_token});
                        if (loginRes.data.code === 200) {
                            const payload = { username: loginRes.data.username, usertoken: access_token };
                            createStore.dispatch('userLogin', payload);
                            router.push({
                              name: 'dashboard',
                            });
                            console.log('You successfully logged in');
                          } else {
                            alert("Authentication Failed");
                          }
                    }
                }
                /* Github Server Flow */
                if (route.query.login_method == 'githubLoginSF') {
                  const resData = await axios.post('http://localhost:8000/login/github_server_flow_redeem_and_login', { code: route.query.code });
                  if (resData.data.code == 404) {
                    alert("Bad Verification Code");
                  } else if (resData.data.code == 200) {
                    const payload = { username: resData.data.username, usertoken: resData.data.token };
                    createStore.dispatch('userLogin', payload);
                    router.push({
                      name: 'dashboard',
                    });
                    console.log('You successfully logged in');
                  } else {
                    alert("Authentication Failed");
                  }
                }
            } catch (error) {
                alert('Unknown Error Occurs');
            } finally {
                // Empty here
            }
        }

  // Start twitter login
  const startTwitterLogin = async (flowType) => {
    changeLoginMethod(flowType);
    try {
      if (flowType == 'twitterLoginSF') {
          const requiredInfo = await axios.get('http://localhost:8000/login/twitter_server_flow_info');
          if (requiredInfo.data.code == 200) {
            const queries = new URLSearchParams(requiredInfo.data.options).toString();
            const tsf_request_link = `https://twitter.com/i/oauth2/authorize?${queries}`;
            window.location.href = tsf_request_link;
          } else {
            alert('Unknown Error Occurs');
          }
      }
    } catch (error) {
        alert('Unknown Error Occurs');
    } finally {
        // Empty here
    }
  }

  // Twitter login - redeem access token and login
  const twitterRedeemAccessTokenAndLogin = async () => {
            try {
                /* Twitter Server Flow */
                  const resData = await axios.post('http://localhost:8000/login/twitter_server_flow_redeem_and_login', { code: route.query.code });
                  if (resData.data.code == 200) {
                    const payload = { username: resData.data.username, usertoken: resData.data.token };
                    createStore.dispatch('userLogin', payload);
                    router.push({
                      name: 'dashboard',
                    });
                    console.log('You successfully logged in');
                  } else {
                    alert("Authentication Failed");
                  }
            } catch (error) {
                alert('Unknown Error Occurs');
            } finally {
                // Empty here
            }
        }

  // start Dropbox login
  const startDropboxLogin = async (flowType) => {
      changeLoginMethod(flowType);
      try {
        if (flowType == 'DropboxSF') {
            const requiredInfo = await axios.get('http://localhost:8000/login/dropbox_server_flow_info'); //
            if (requiredInfo.data.code == 200) {
              const queries = new URLSearchParams(requiredInfo.data.options).toString();
              const tsf_request_link = `https://www.dropbox.com/oauth2/authorize?${queries}`;
              window.location.href = tsf_request_link;
            } else {
              alert('Unknown Error Occurs');
            }
        }
      } catch (error) {
          alert('Unknown Error Occurs');
      } finally {
          // Empty here
      }
    }

    const dropboxRedeemAccessTokenAndLogin = async () => { 
      try {
          /* DropBox Server Flow */
            const resData = await axios.post('http://localhost:8000/login/dropbox_server_flow_redeem_and_login', { code: route.query.code }); //
            if (resData.data.code == 200) {
              const payload = { username: resData.data.username, usertoken: resData.data.token };
              createStore.dispatch('userLogin', payload);
              router.push({
                name: 'dashboard',
              });
              console.log('You successfully logged in');
            } else {
              alert("Authentication Failed");
            }
          } catch (error) {
              alert('Unknown Error Occurs');
          } finally {
              // Empty here
          }
    }

  // check if it is needed to redirect to the dashboard automatically
  const checkLoginMethod = () => {
      if (route.query.code && route.query.code.length !== 0) {
        if (!route.query.login_method) {
          router.push({query: {...route.query, login_method: createStore.getters.getLoginMethod }});
        }
        setTimeout(() => {
          if (route.query.login_method && route.query.login_method.includes('github')) {
            githubRedeemAccessTokenAndLogin();
        } else if (route.query.login_method && route.query.login_method.includes('twitter')) {
            twitterRedeemAccessTokenAndLogin();
        } else if (route.query.login_method && route.query.login_method.includes('Dropbox')){
          dropboxRedeemAccessTokenAndLogin();
        } 
        }, 10);
      }
  }
  
  checkLoginMethod();

  return {
    account_login_form,
    accountLogin,
    startGithubLogin,
    startTwitterLogin,
    startDropboxLogin,
  }
},
});
</script>

<style>
.login-link {
  display: block;
  padding-top: 10px;
  text-align: center;
  text-decoration: none;
  color: black;
}

</style>
