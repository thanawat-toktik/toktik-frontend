<template>
  <div>
    <b-container fluid="md">
      <b-card title="Log In">
        <b-form @submit.prevent="onSubmit">
          <!-- Email -->
          <b-form-group
            label="Email"
            label-for="email"
            label-cols="1"
            label-align="right"
            style="text-align: left"
          >
            <b-form-input
              id="email"
              v-model="email"
              required
              placeholder="Sample: helloworld@toktik.com"
              type="email"
            ></b-form-input>
          </b-form-group>

          <!-- Password -->
          <b-form-group
            label="Password"
            label-for="password"
            label-cols="1"
            label-align="right"
            style="text-align: left"
          >
            <b-form-input
              id="password"
              type="password"
              v-model="password"
              required
              placeholder="Type in your password"
            ></b-form-input>
          </b-form-group>
          <p v-if="error" style="color: red">{{ error }}</p>
          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import router from "@/router";
import axios from "axios";
import instance from "@/axios";
import io from "socket.io-client";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async onSubmit() {
      try {
        const formData = new FormData();
        formData.append("email", this.email);
        formData.append("password", this.password);

        const response = await axios
          .create()
          .post(`/api/auth/jwt/create/`, formData);

        // after login, include jwt token to every header
        localStorage.setItem("jwt-token", response.data.access);
        localStorage.setItem("jwt-token-refresh", response.data.refresh);
        localStorage.setItem("username", response.data.username);
        instance.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.access;

        const socket = io("ws://localhost:3000/", {
          reconnectionDelayMax: 10000,
          withCredentials: true,
        });
        socket.on("connect", () => {
          console.log("connected");
        });
        await router.push({ name: "feed" });
      } catch (error) {
        this.error = "An error occurred during login. Please try again.";
        console.error("Error:", error);
      }
    },
  },
};
</script>
