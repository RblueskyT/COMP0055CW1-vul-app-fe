<template>
  <div class="example">
    <h1>Tweet Page</h1>
    <input placeholder="Enter the tweet text" v-model="tweet" />
    <button @click="handleSubmit()" >Tweet</button>
  </div>
</template>

<script>
    import { defineComponent, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';

    export default defineComponent({
        setup() {
            const tweet = ref('');
            const accessToken = localStorage.getItem("TwitterAccessToken");
            const router = useRouter();

            if(!accessToken){
                router.push('login')
                alert('you need to login before comming to /tweet page')
            }

            const handleSubmit = async () => {
                if(tweet.value){
                    const resData = await axios({
                        method: 'post', //you can set what request you want to be
                        url: 'http://localhost:8000/login/tweet',
                        data: {text: tweet.value,token:accessToken},
                    })
                    
                    if (resData.status === 200) {
                        alert("tweet is submitted successfully");
                        console.log(resData.data); 
                    }else if (resData.status == 403){
                        localStorage.clear('TwitterAccessToken')
                        router.push('login');
                        alert(resData.data);
                    }
                     else {
                        alert(resData.data);
                    }
                }else{
                    alert('you can not post an empty tweet')
                }
            }

            return {
                tweet,
                handleSubmit
            };
        }

    })
    

</script>