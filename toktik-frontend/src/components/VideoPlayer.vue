<template>
  <div v-show="videoLoaded">
    <h2>Video Player</h2>
    <video
        ref="s3VideoPlayer"
        id="video"
        class="video-js vjs-default-skin"
        preload="auto"
        crossorigin="use-credentials"
        controls
        width="640"
        height="268"
        data-setup='{ "fluid": true }'
        autoplay="true"
    ></video>
  </div>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-hls";
import axios from '@/axios';

export default {
  name: "video-player",
  data() {
    return {
      player: null,
      videoLoaded: false,
      videoId: 25,
    };
  },
  mounted() {
    this.videoLoaded = false;
    this.getVideo();
  },
  beforeDestroy() {
    if (this.player.src()) {
      URL.revokeObjectURL(this.player.src());
    }
    if (this.player) {
      this.player.dispose();
    }
  },
  methods: {
    async getVideo() {
      try {
        const response = await axios({
          method: "GET",
          url: `/api/video/get-url/`,
          params: {
            video_id: this.videoId,
          },
          credentials: "include",
        });
        const playlistBlob = new Blob([response.data], {type: "text/plain"});
        const playlistURL = URL.createObjectURL(playlistBlob);
        if (!this.player) {
          this.initVideoPlayer(playlistURL);
        }
        this.videoLoaded = true;
        // TODO: incr view to the video with this id
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    },

    initVideoPlayer(fileUrl) {
      // videojs.options.html5.nativeAudioTracks = false;
      // videojs.options.html5.nativeTextTracks = false;

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
    },
  },
};
</script>
