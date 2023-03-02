<template>
  <div class="login" style="text-align: center;">
    <h1>Vulnerable App User Login</h1>
    <form>
      <label for="username">Username:</label><br>
      <input type="text" id="username" name="username" v-model="account_login_form.username"><br>
      <label for="password">Password:</label><br>
      <input type="password" id="password" name="password" v-model="account_login_form.password"><br><br>
      <button type="button" @click="accountLogin">Log In</button>
    </form>
    <p>or</p>
    <button type="button" @click="startGithubLogin('githubLoginCF')">
        <span>Log In with GitHub (Client-Flow)</span>
    </button>
    <!-- <a
      className="login-link"
      :href= link >
        <span>Login with GitHub</span>
    </a>

    <a
      className="login-link"
      :href= twitterLink >
        <span>Login with Twitter</span>
    </a> -->
    
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
            createStore.commit('login', account_login_form.value.username)
            router.push({
              name: 'dashboard',
            });
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
  const startGithubLogin = (flowType) => {
    changeLoginMethod(flowType);
    window.location.href = gcf_request_link;
  }

  // Github login - redeem access token and login
  const githubRedeemAccessTokenAndLogin = async () => {
            try {
                /* Github Client Flow */
                if (createStore.getters.getLoginMethod == 'githubLoginCF') {
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
                            createStore.commit('login', loginRes.data.username)
                            router.push({
                              name: 'dashboard',
                            });
                          } else {
                            alert("Authentication Failed");
                          }
                    }
                }
                /* Github Server Flow */
                if (createStore.getters.getLoginMethod == 'githubLoginSF') {
                    // todo
                }
            } catch (error) {
                alert('Unknown Error Occurs');
            } finally {
                // Empty here
            }
        }

  // check if it is needed to redirect to the dashboard automatically
  const checkLoginMethod = () => {
      const login_method = localStorage.getItem('login_method');
      createStore.commit('changeLoginMethod', login_method);
      if (login_method.includes('github')) {
            if(route.query.code && route.query.code.length != 0) {
              githubRedeemAccessTokenAndLogin();
            }
      }
      if (login_method.includes('twitter')) {
        // todo
      }
  }
  
  checkLoginMethod();

  // const client_id = ref('Iv1.4ecad6f945b81b88');
  // const redirect_uri = ref('http://localhost:8080/login')
  // const link = ref('https://github.com/login/oauth/authorize?scope=user&client_id='+client_id.value+'&redirect_uri='+redirect_uri.value)
  // const Twitter_client_id = ref('UGxoMHJDc0JFcWNvMzkxeDZjMEk6MTpjaQ');

  // function getTwitterOauthUrl() {
  //   const rootUrl = "https://twitter.com/i/oauth2/authorize";
  //   const options = {
  //     redirect_uri: "http://localhost:8080/login", 
  //     client_id: Twitter_client_id.value,
  //     state: "state",
  //     response_type: "code",
  //     code_challenge: "challenge",
  //     code_challenge_method: "plain",
  //     scope: ["users.read","tweet.write", "tweet.read", "follows.read", "follows.write"].join(" "),
  //   };
  //   const qs = new URLSearchParams(options).toString();
  //   return `${rootUrl}?${qs}`;
  // }

  // const twitterLink = ref(getTwitterOauthUrl());

  // const route = useRoute();
  // const code = route.query.code;
  // const state = route.query.state;
  // const router = useRouter();
  // const returned_msg = ref('Guest');

  // const getTestMsg = () => {
  //   test_msg.value = "Guest"
  // };
  
  // const Login = async (code) => {
  //   try {

  //       const resData = await axios.get("http://localhost:8000/login/github_login", {params: {code: code}});
  //       // const resData = await axios.post('http://localhost:8000/login/github_login',{code:code});
  //       if (resData.status === 200) {
  //         console.log(resData.data)
  //         console.log(resData.data.data)
  //         console.log(resData.data.token)
  //         // returned_msg.value = resData
  //         document.cookie = `access_token=${resData.data.token}`
  //       } else {
  //         alert(resData.data);
  //       }
  //     } catch (error) {
  //       alert(error.response.data);
  //     } finally {
  //       // Empty here
  //   }
  // }

  // const LoginWithTwitter = async (code) => {
  //   try {
  //       const resData = await axios.post('http://localhost:8000/login/twitter_login',{code:code});
  //       if (resData.status === 200) {
  //         localStorage.setItem("TwitterAccessToken",resData.data.token)
  //         router.push('tweet')
  //       } else {
  //         alert(resData.data);
  //       }
  //     } catch (error) {
  //       alert(error.response.data);
  //     } finally {
  //       // Empty here
  //   }
  // }

  // getTestMsg();
  
  // if (code){
  //   if(state){
  //     LoginWithTwitter(code);
  //   }else{
  //     Login(code);
  //   }
  // }
  // TwitterUrl()


  return {
    account_login_form,
    // link,
    // twitterLink,
    accountLogin,
    startGithubLogin,
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
