<template>
  <div id="app">
    <NavBar></NavBar>
    <router-view/>
    <GenericInfoModal></GenericInfoModal>
  </div>
</template>

<script>
import GenericInfoModal from './components/GenericInfoModal.vue';
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    GenericInfoModal,
    NavBar,
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
</style>
