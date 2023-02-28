<template>
  <div class="login">
    <h1 style="text-align: center;">Vulnerable App User Login</h1>
    <form style="text-align: center;">
      <label for="username">Username:</label><br>
      <input type="text" id="username" name="username" v-model="account_login_form.username"><br>
      <label for="password">Password:</label><br>
      <input type="password" id="password" name="password" v-model="account_login_form.password"><br><br>
      <button type="button" @click="accountLogin">Log In</button>
    </form>
    <p style="text-align: center;">or</p>
    <a
      className="login-link"
      :href= link >
        <span>Login with GitHub</span>
    </a>

    <a
      className="login-link"
      :href= twitterLink >
        <span>Login with Twitter</span>
    </a>
    
  </div>
</template>

<script>
  import {  defineComponent,ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import createStore from "@/store";
  import axios from 'axios';
  
  export default defineComponent({
  setup() {
  // const test_msg = ref('');
  const account_login_form = ref({username: '', password: ''});

  const client_id = ref('Iv1.4ecad6f945b81b88');
  const redirect_uri = ref('http://localhost:8080/login')
  const link = ref('https://github.com/login/oauth/authorize?scope=user&client_id='+client_id.value+'&redirect_uri='+redirect_uri.value)
  const Twitter_client_id = ref('UGxoMHJDc0JFcWNvMzkxeDZjMEk6MTpjaQ');

  function getTwitterOauthUrl() {
    const rootUrl = "https://twitter.com/i/oauth2/authorize";
    const options = {
      redirect_uri: "http://localhost:8080/login", 
      client_id: Twitter_client_id.value,
      state: "state",
      response_type: "code",
      code_challenge: "challenge",
      code_challenge_method: "plain",
      scope: ["users.read","tweet.write", "tweet.read", "follows.read", "follows.write"].join(" "),
    };
    const qs = new URLSearchParams(options).toString();
    return `${rootUrl}?${qs}`;
  }

  const twitterLink = ref(getTwitterOauthUrl());

  const route = useRoute();
  const code = route.query.code;
  const state = route.query.state;
  const router = useRouter();
  // const returned_msg = ref('Guest');

  // const getTestMsg = () => {
  //   test_msg.value = "Guest"
  // };

  const accountLogin = async () => {
    try {
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
  
  const Login = async (code) => {
    try {

        const resData = await axios.get("http://localhost:8000/login/github_login", {params: {code: code}});
        // const resData = await axios.post('http://localhost:8000/login/github_login',{code:code});
        if (resData.status === 200) {
          console.log(resData.data)
          console.log(resData.data.data)
          console.log(resData.data.token)
          // returned_msg.value = resData
          document.cookie = `access_token=${resData.data.token}`
        } else {
          alert(resData.data);
        }
      } catch (error) {
        alert(error.response.data);
      } finally {
        // Empty here
    }
  }

  const LoginWithTwitter = async (code) => {
    try {
        const resData = await axios.post('http://localhost:8000/login/twitter_login',{code:code});
        if (resData.status === 200) {
          localStorage.setItem("TwitterAccessToken",resData.data.token)
          router.push('tweet')
        } else {
          alert(resData.data);
        }
      } catch (error) {
        alert(error.response.data);
      } finally {
        // Empty here
    }
  }

  // getTestMsg();
  
  if (code){
    if(state){
      LoginWithTwitter(code);
    }else{
      Login(code);
    }
  }
  // TwitterUrl()


  return {
    account_login_form,
    link,
    twitterLink,
    accountLogin,
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
