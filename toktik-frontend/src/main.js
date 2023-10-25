// import '@babel/polyfill'
// import 'mutationobserver-shim'
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import axios from "./axios";
import VueAxios from "vue-axios";
import router from './router'

import VideoPlayer from "./components/VideoPlayer.vue";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // TODO: dangerous remove this if possible

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

// Components
Vue.component('VideoPlayer', VideoPlayer);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

