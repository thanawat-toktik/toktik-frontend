<template>
  <b-navbar toggleable="sm">
    <b-navbar-brand href="#">
      <img src="../assets/logo-icon-small.png" alt="Toktik Logo" style="height: 35px">
      <img src="../assets/logo-text.png" alt="Toktik text" style="height: 35px">
    </b-navbar-brand>

    <b-collapse id="nav-text-collapse" is-nav>
      <b-navbar-nav justified align="right" fill>
        <b-nav-item to="/">
          <b-nav-text>Home</b-nav-text>
        </b-nav-item>
        <b-nav-item to="/about">
          <b-nav-text>About</b-nav-text>
        </b-nav-item>
        <b-nav-item to="/login">
          <b-nav-text>Login</b-nav-text>
        </b-nav-item>
        <b-nav-item to="/register">
          <b-nav-text>Register</b-nav-text>
        </b-nav-item>
        <b-nav-item to="/upload">
          <b-nav-text>Upload</b-nav-text>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
  </b-navbar>
</template>

<script>
export default {
  name: 'NavBar',
}
</script>
