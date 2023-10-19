<template>
  <div id="app">
    <nav>
      <p>Temp nav bar</p>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link> |
      <router-link to="/upload">Upload Video</router-link>
    </nav>
    <router-view/>
    
    <GenericInfoModal></GenericInfoModal>
  </div>
</template>

<script>
import GenericInfoModal from './components/GenericInfoModal.vue';

export default {
  name: 'App',
  components: {
    GenericInfoModal
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
