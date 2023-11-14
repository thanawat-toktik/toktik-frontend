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
        <b-nav-item v-if="isLoggedIn"
          >Logged in as <b>{{ username }}</b></b-nav-item
        >
        <b-nav-item v-if="isLoggedIn" @click="onBellRung">
          <b-iconstack scale="1.2" id="notification-bell">
            <b-icon stacked style="color: black" icon="bell"></b-icon>
            <b-icon
              stacked
              style="color: white"
              shift-h="5"
              shift-v="5"
              scale="0.55"
              icon="circle-fill"
              v-if="hasUnseenNotifications"
            ></b-icon>
            <b-icon
              stacked
              style="color: red"
              shift-h="5"
              shift-v="5"
              scale="0.45"
              icon="circle-fill"
              v-if="hasUnseenNotifications"
            ></b-icon>
          </b-iconstack>
        </b-nav-item>
        <b-popover
          v-if="isLoggedIn"
          target="notification-bell"
          class="notification-popover"
          triggers="focus"
          title="What's new?"
          placement="bottomleft"
          no-fade
        >
          <b-card no-body border-variant="white" class="notification-card">
            <b-list-group v-if="notifications.length > 0" flush>
              <b-list-group-item
                v-for="(notification, index) in notifications"
                :key="index"
              >
                {{ notification.message }}
              </b-list-group-item>
            </b-list-group>
            <b-card-text v-else>No notifications.</b-card-text>
          </b-card>
        </b-popover>
        <b-nav-item v-if="isLoggedIn">
          <b-icon
            style="color: black; scale: 1.25"
            icon="door-open"
            v-on:click="onLogout"
          ></b-icon>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-navbar-toggle
      style="background: white"
      target="nav-text-collapse"
    ></b-navbar-toggle>
  </b-navbar>
</template>

<script>
import router from "@/router";
import axios from "@/axios";
import { EventBus } from "@/eventBus";

export default {
  name: "NavBar",
  data() {
    return {
      isLoggedIn: false,
      // notifications: [
      //   "God is dead",
      //   "God remains dead",
      //   "And we have killed him",
      // ],
      notifications: [],
      username: "",
      hasUnseenNotifications: false,
    };
  },
  async created() {
    await this.checkToken();
    EventBus.$on("token-update", () => {
      this.checkToken();
    });

    EventBus.$on("fetch-notifications", async () => {
      axios
        .get("/api/notification/fetch/", {
          withCredentials: true,
        })
        .then((response) => {
          this.notifications = response.data;
          this.updateUnseenNotifications();
        })
        .catch((error) => {
          console.error(error);
        });
    });

    EventBus.$on("check-login", () => {
      this.username = localStorage.getItem("username");
    });

    if (this.notifications.length <= 0 && this.isLoggedIn) {
      EventBus.$emit("fetch-notifications");
    }

    if (this.isLoggedIn) {
      this.username = localStorage.getItem("username");
    }
  },
  methods: {
    async checkToken() {
      const token = localStorage.getItem("jwt-token");
      const refresh = localStorage.getItem("jwt-token-refresh");
      // if token and refresh is present, user is logged in
      this.isLoggedIn = token && refresh;
    },

    async onLogout() {
      localStorage.clear();
      axios.defaults.headers.common["Authorization"] = "";
      EventBus.$emit("show-modal", {
        title: "Log-out Successful",
        message: "You are now logged out!",
      });
      await router.push({ name: "login" });
    },

    updateUnseenNotifications() {
      if (this.notifications.length <= 0) {
        this.hasUnseenNotifications = false;
        return;
      }
      const allIsSeen = this.notifications
        .map((notification) => {
          return notification.isSeen;
        })
        .reduce((a, b) => a && b);
      this.hasUnseenNotifications = !allIsSeen;
    },

    async onBellRung() {
      await axios
        .post(
          "/api/notification/update-seen/",
          {
            notification_ids: this.notifications.map((notification) => {
              return notification.notifId;
            }),
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 201) {
            this.notifications.forEach((notification) => {
              notification.isSeen = true;
            });
            this.updateUnseenNotifications();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },

  sockets: {
    [`user-${localStorage.getItem("userId")}`]: function (data) {
      this.notifications.unshift(data);
      if (this.notifications.length > 5) {
        this.notifications.pop();
      }
      this.updateUnseenNotifications();
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

.notification-card {
  width: 250px;
  margin: 0;
}

.notification-popover {
  position: absolute;
}
</style>
