<template>
  <div class="login">
    <h1>This is the login page</h1>
    <h2 style="color: green"> Welcome {{ returned_msg }}</h2>
    <a
      className="login-link"
      :href= link >
        <span>Login with GitHub</span>
    </a>
    
  </div>
</template>

<script>
  import {  defineComponent,ref } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  export default defineComponent({
  setup() {
  const test_msg = ref('');
  const client_id = ref('Iv1.4ecad6f945b81b88');
  const redirect_uri = ref('http://localhost:8080/login')
  const link = ref('https://github.com/login/oauth/authorize?scope=user&client_id='+client_id.value+'&redirect_uri='+redirect_uri.value)
  const route = useRoute();
  const code = route.query.code;
  const returned_msg = ref('Guest');

  const getTestMsg = () => {
    test_msg.value = "Guest"
  };
  
  const Login = async (code) => {
    try {
        const resData = await axios.post('http://localhost:8000/login/github_login',{code:code});
        if (resData.status === 200) {
          console.log(resData.data)
          console.log(resData.data.data)
          console.log(resData.data.token)
          returned_msg.value = resData
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

  getTestMsg();
  
  if (code){
    Login(code);
  }


  return {
    link
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
