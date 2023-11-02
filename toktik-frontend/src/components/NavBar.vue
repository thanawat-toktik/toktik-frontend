<template>
  <b-navbar toggleable="sm">
    <b-navbar-brand href="#">
      <img
        src="../assets/logo-icon-small.png"
        alt="Toktik Logo"
        style="height: 35px"
      />
      <img
        src="../assets/logo-text.png"
        alt="Toktik text"
        style="height: 35px"
      />
    </b-navbar-brand>

    <b-collapse id="nav-text-collapse" is-nav>
      <b-navbar-nav justified align="right" fill>
        <b-nav-item to="/" v-if="isLoggedIn">
          <b-nav-text>Home</b-nav-text>
        </b-nav-item>
        <b-nav-item to="/feed" v-if="isLoggedIn">
          <b-nav-text>Feed</b-nav-text>
        </b-nav-item>
        <b-nav-item v-if="isLoggedIn">
          <b-nav-text v-on:click="onLogout">Logout</b-nav-text>
        </b-nav-item>
        <b-nav-item to="/login" v-else>
          <b-nav-text>Login</b-nav-text>
        </b-nav-item>
        <b-nav-item to="/register">
          <b-nav-text>Register</b-nav-text>
        </b-nav-item>
        <b-nav-item to="/upload" v-if="isLoggedIn">
          <b-nav-text>Upload</b-nav-text>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
  </b-navbar>
</template>

<script>
import router from "@/router";
import axios from "@/axios";
import { EventBus } from '@/eventBus';

export default {
  name: "NavBar",
  data () {
    return {
      isLoggedIn: false
    }
  },
  created() {
    this.checkToken()
    EventBus.$on("token-update", () => {
      this.checkToken()
    });
  },
  methods: {
    async checkToken() {
      const token = localStorage.getItem("jwt-token")
      const refresh = localStorage.getItem("jwt-token-refresh")
      // if token and refresh is present, user is logged in
      this.isLoggedIn = token && refresh
    },

    async onLogout() {
      const token = localStorage.getItem("jwt-token");
      const token_refresh = localStorage.getItem("jwt-token-refresh");
      if (token) {
        localStorage.removeItem('jwt-token')
        axios.defaults.headers.common['Authorization'] = '';
      }
      if (token_refresh) {
        localStorage.removeItem("jwt-token-refresh");
      }
      EventBus.$emit('show-modal', { title: 'Log-out Successful', message: 'You are now logged out!'} );
      await router.push({ name: "login" });
    },
    
  }
};
</script>
