<template>
<div class="custom-modal-backdrop" v-if="showPopUp">
  <span class="close-button" @click="closePopUp">X</span>
  <span class="prev-button" @click="prevVideo">&lt;</span>
  <span class="next-button" @click="nextVideo">&gt;</span>
  <div class="video-player" v-if="showVideo">
    <VideoPlayer
      :video="videoId" 
      :playOnce="playOnce"
      class="center-fit"
    ></VideoPlayer>
  </div>
</div>
</template>

<script>
import { nextTick } from 'vue';
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
          playOnce: false,
      };
  },
  created() {
    EventBus.$on("play-video", async (videoId) => {
      this.showVideo = false;
      this.videoId = videoId;
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
        EventBus.$emit("play-next-video")
      },
      prevVideo() {
        EventBus.$emit("play-prev-video")
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
  /* justify-content: center; */
  align-items: center;
  z-index: 11000;
}

.video-player {
  position: fixed;
  width: 80%;
  height: 80%;
  transform: translate(0%, -10%);
  border-radius: 5px;
  z-index: 11001;
}

.center-fit {
  max-width: 100%;
  max-height: 100vh;
  margin: auto;
}

.close-button {
  position: fixed;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 11002;
  color: white;
  font-size: larger;
}

.prev-button {
  position: fixed;
  left: 10px;
  cursor: pointer;
  z-index: 11002;
  color: white;
  font-size: larger;
}
.next-button {
  position: fixed;
  right: 10px;
  cursor: pointer;
  z-index: 11002;
  color: white;
  font-size: larger;
}
</style>
