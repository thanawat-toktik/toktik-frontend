<template>
  <b-navbar toggleable="sm" class="navbar" fixed="top" justified>
    <b-navbar-brand href="#">
      <img
          src="../assets/logo-icon-small.png"
          alt="Toktik logo"
          style="height: 35px"
      />
      <img
          src="../assets/logo-text.png"
          alt="Toktik text"
          style="height: 35px"
      />
    </b-navbar-brand>

    <b-collapse id="nav-text-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/feed" v-if="isLoggedIn">
          <b-nav-text class="navbar-text">Feed</b-nav-text>
        </b-nav-item>
        <b-nav-item to="/" v-if="isLoggedIn">
          <b-nav-text class="navbar-text">My Videos</b-nav-text>
        </b-nav-item>
        <b-nav-item to="/upload" v-if="isLoggedIn">
          <b-nav-text class="navbar-text">Upload</b-nav-text>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/login" v-if="!isLoggedIn">
          <b-nav-text class="navbar-text">Login</b-nav-text>
        </b-nav-item>
        <b-nav-item to="/register" v-if="!isLoggedIn">
          <b-nav-text class="navbar-text">Register</b-nav-text>
        </b-nav-item>
        <b-nav-item v-if="isLoggedIn">
          <b-iconstack scale="1.2">
            <b-icon stacked style="color: black;" icon="bell"></b-icon>
            <b-icon stacked style="color: white;" shift-h="5" shift-v="5" scale="0.55" icon="circle-fill"></b-icon>
            <b-icon stacked style="color: red;" shift-h="5" shift-v="5" scale="0.45" icon="circle-fill"></b-icon>
          </b-iconstack>
        </b-nav-item>
        <b-nav-item v-if="isLoggedIn">
          <b-icon style="color: black; scale: 1.25;" icon="door-open" v-on:click="onLogout"></b-icon>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-navbar-toggle style="background: white;" target="nav-text-collapse"></b-navbar-toggle>
  </b-navbar>
</template>

<script>
import router from "@/router";
import axios from "@/axios";
import {EventBus} from "@/eventBus";

export default {
  name: "NavBar",
  data() {
    return {
      isLoggedIn: false,
    };
  },
  created() {
    this.checkToken();
    EventBus.$on("token-update", () => {
      this.checkToken();
    });
  },
  methods: {
    async checkToken() {
      const token = localStorage.getItem("jwt-token");
      const refresh = localStorage.getItem("jwt-token-refresh");
      // if token and refresh is present, user is logged in
      this.isLoggedIn = token && refresh;
    },

    async onLogout() {
      const token = localStorage.getItem("jwt-token");
      const token_refresh = localStorage.getItem("jwt-token-refresh");
      if (token) {
        localStorage.removeItem("jwt-token");
        axios.defaults.headers.common["Authorization"] = "";
      }
      if (token_refresh) {
        localStorage.removeItem("jwt-token-refresh");
      }
      EventBus.$emit("show-modal", {
        title: "Log-out Successful",
        message: "You are now logged out!",
      });
      await router.push({name: "login"});
    },
  },
};
</script>

<style scoped>
.navbar {
  background-color: white;
  height: 60px;
  border-bottom: 1px solid lightgrey;
  margin-bottom: -1px;
}

.navbar-text {
  font-weight: 700;
  font-size: 18px;
  color: #111111;
}
</style>
