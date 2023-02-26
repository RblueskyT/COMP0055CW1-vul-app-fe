<template>
  <div class="login">
    <h1>This is the login page</h1>
    <h2 style="color: green"> Welcome {{ returned_msg }}</h2>
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
  import axios from 'axios';
  
  export default defineComponent({
  setup() {
  // const test_msg = ref('');
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
    link,
    twitterLink
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
