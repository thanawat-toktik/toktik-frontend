<template>
  <div class="custom-modal-backdrop" v-if="showPopUp">
    <span class="close-button" @click="closePopUp">
      <b-icon icon="x-lg"></b-icon>
    </span>
    <span class="prev-button" @click="prevVideo">
      <b-icon icon="chevron-left"></b-icon>
    </span>
    <span class="next-button" @click="nextVideo">
      <b-icon icon="chevron-right"></b-icon>
    </span>
    <b-card class="video-player" v-if="showVideo" no-body border-variant="dark">
      <b-row>
        <b-col cols="8">
          <VideoPlayer :video="videoId" :playOnce="playOnce"></VideoPlayer>
        </b-col>
        <b-col class="custom-vid-details">
          <h1>{{ videoTitle }}</h1>
          <h5>
            uploaded by <b>{{ videoOwner }}</b>
          </h5>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import { nextTick } from "vue";
import { EventBus } from "@/eventBus";
import VideoPlayer from "@/components/VideoPlayer.vue";

export default {
  data() {
    return {
      components: {
        VideoPlayer,
      },
      showPopUp: false,
      showVideo: false,
      videoId: -1,
      videoTitle: "",
      videoOwner: "",
      playOnce: false,
    };
  },
  created() {
    EventBus.$on("play-video", async (video) => {
      this.playOnce = false;
      this.showVideo = false;
      this.videoId = video.id;
      this.videoTitle = video.title;
      this.videoOwner = video.uploader.username;
      await nextTick();
      this.showPopUp = true;
      this.showVideo = true;
    });
    EventBus.$on("play-video-once", async (videoId) => {
      this.playOnce = true;
      this.videoId = videoId;
      this.showPopUp = true;
      this.showVideo = true;
    });
    EventBus.$on("stop-video", () => {
      this.showPopUp = false;
      this.showVideo = false;
      this.videoId = -1;
    });
  },
  methods: {
    closePopUp() {
      this.showPopUp = false;
    },
    nextVideo() {
      EventBus.$emit("play-next-video");
    },
    prevVideo() {
      EventBus.$emit("play-prev-video");
    },
  },
};
</script>

<style>
.custom-modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  z-index: 11000;
}

.custom-vid-details {
  padding: 10px;
  text-align: left;
}

.video-player {
  max-height: 90%;
  width: 75%;
}

.close-button {
  position: fixed;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 11002;
  color: white;
}

.prev-button {
  position: fixed;
  left: 10px;
  cursor: pointer;
  z-index: 11002;
  color: white;
}

.next-button {
  position: fixed;
  right: 10px;
  cursor: pointer;
  z-index: 11002;
  color: white;
}
</style>
