<template>
  <div v-show="videoLoaded">
    <video
      ref="s3VideoPlayer"
      id="video"
      class="video-js vjs-default-skin vjs-1-1"
      preload="auto"
      crossorigin="use-credentials"
      controls
      autoplay="autoplay"
      width="1000"
    ></video>
  </div>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-hls";
import axios from "@/axios";
import { EventBus } from "@/eventBus";

export default {
  name: "video-player",
  props: {
    video: Number,
    playOnce: Boolean,
  },
  data() {
    return {
      player: null,
      videoLoaded: false,
      videoId: -1,
    };
  },
  mounted() {
    this.videoId = this.video;
    this.videoLoaded = false;
    this.sockets.subscribe(`video-comment-${this.video}`, (data) => {
      if (data.user_id !== parseInt(localStorage.getItem("userId"))) {
        EventBus.$emit("update-comment", data);
      }
    });
    this.getVideo();
  },
  beforeDestroy() {
    if (this.player.src()) {
      URL.revokeObjectURL(this.player.src());
    }
    if (this.player) {
      this.player.dispose();
    }
    this.sockets.unsubscribe(`video-comment-${this.video}`);
  },
  methods: {
    async getVideo() {
      if (this.videoId < 0) {
        return;
      }
      try {
        const response = await axios({
          method: "GET",
          url: `/api/video/get-playlist/`,
          params: {
            video_id: this.videoId,
          },
          credentials: "include",
        });
        const playlistBlob = new Blob([response.data], { type: "text/plain" });
        const playlistURL = URL.createObjectURL(playlistBlob);
        if (!this.player) {
          this.initVideoPlayer(playlistURL);
        }
        this.videoLoaded = true;
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    },

    initVideoPlayer(fileUrl) {
      this.player = videojs(this.$refs.s3VideoPlayer, {
        techOrder: ["html5"],
        html5: {
          hls: {
            overrideNative: true,
            withCredentials: true,
          },
        },
      });

      this.player.src({
        src: fileUrl,
        type: "application/x-mpegURL",
      });

      this.player.on("error", (error) => {
        console.error("VIDEOJS: ERROR:", error);
      });
      this.player.on("ended", () => {
        if (!this.playOnce) {
          this.increaseView();
          EventBus.$emit("play-next-video");
        }
        // if you want the player to go away after ending (for play once)
        // do this --> EventBus.$emit("stop-video")
      });
    },

    async increaseView() {
      try {
        await axios({
          method: "GET",
          url: `/api/video/${this.videoId}/view/`,
          credentials: "include",
        });
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    },
  },
};
</script>
