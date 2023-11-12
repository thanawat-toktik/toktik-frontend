import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import axios from "./axios";
import VueAxios from "vue-axios";
import router from "./router";
import VueSocketIO from "vue-socket.io";
import SocketIOSocket from "socket.io-client";

import VideoPlayer from "./components/VideoPlayer.vue";

export const SocketInstance = SocketIOSocket("ws://localhost:3000/", {
  reconnectionDelayMax: 10000,
  withCredentials: true,
});
Vue.use(new VueSocketIO({
  connection: SocketInstance,
}));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: dangerous remove this if possible

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

// Components
Vue.component("VideoPlayer", VideoPlayer);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
