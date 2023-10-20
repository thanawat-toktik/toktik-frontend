// import '@babel/polyfill'
// import 'mutationobserver-shim'
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import axios from "axios";
import { EventBus } from './eventBus.js';
import VueAxios from "vue-axios";
import router from './router'

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

// TOKEN
const token = localStorage.getItem('jwt-token')
if (token) {
  Vue.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
const refresh_token = localStorage.getItem('jwt-token-refresh')
if (refresh_token) {
  Vue.axios.defaults.headers.common['Authorization'] = 'Bearer ' + refresh_token;
}


// ERROR INTERCEPT
Vue.axios.interceptors.response.use(
  (response) => {
    return response
  }, 
  async (error) => {
    const status = error.response.status ?? 0
    if (status === 401) {
      EventBus.$emit('show-modal', { title: 'Unauthorized', message: 'Please Log-in again'} );
      const token = localStorage.getItem('jwt-token')
      if (token) {
        localStorage.removeItem('jwt-token')
      }
      const refresh_token = localStorage.getItem('jwt-token-refresh')
      if (refresh_token) {
        localStorage.removeItem('jwt-token-refresh')
      }
      router.push('/login')
    }

    EventBus.$emit('show-modal', { title: 'Error occurred', message: error.message} );
    return Promise.reject(error)
  })

// Vue.axios.interceptors.response.use(
//   (response) => {
//     return response
//   }, 
//   async (error) => {
//     console.log(error)
//     if (!error.response) {
//       console.log("Unhandled error")
//     }
//     if (error.response.status === 401) {

//       // checks if there's a pre-existing accesstoken
//       const token = localStorage.getItem('jwt-token')
//       if (!token) {
//         router.push('/login')
//       }
//       if (token) { // remove existing token
//         localStorage.removeItem('jwt-token')
//       }
      
      
//       // checks for refresh token
//       const refresh_token = localStorage.getItem('jwt-token-refresh')
//       if (!refresh_token) { // needs to log in if no refresh token
//         router.push('/login')
//       }

//       try { // try to get new token
//         const formData = new FormData();
//         formData.append('refresh', refresh_token)

//         const response = Vue.axios({
//           method: "POST",
//           url: `${process.env.VUE_APP_BACKEND_HOST}/auth/jwt/refresh/`,
//           data: formData,
//         });
//         // TODO: solve why this returns nothing
//         console.log(`Response: ${JSON.stringify(response)}`);
//         // applies new token
//         Vue.axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access;
//         localStorage.setItem( 'jwt-token', response.data.access );
//       }
//       catch (error) {
//         console.log(error)
//         // forces user to get a new token
//         localStorage.removeItem('jwt-token-refresh')
//         await router.push({ name: "Log-In" });
//       }      
//     }
//     return Promise.reject(error)
//   })
