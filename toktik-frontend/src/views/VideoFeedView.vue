<template>
  <div>
    <h1>THE FEED</h1>
    <!-- This is the whole page -->
    <div class="feed_container">
      <!-- This is for each video -->
      <div v-for="(video, index) in videos" :key="index" class="video_block">
        <div>
          <img
            :src="video_thumbnails[index]"
            alt="Thumbnail"
            @click="viewVideo(video, index)"
          />
        </div>
        <div class="video_block__text">
          <h4>{{ video.title }}</h4>
          <p>By: {{ video.uploader.username }}</p>
          <p>{{ video.view }} views</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";
import { EventBus } from "@/eventBus";

export default {
  data() {
    return {
      videos: [],
      video_ids: [],
      video_thumbnails: [],
      current_video_index: 0,
    };
  },
  mounted() {
    this.fetchVideos();
  },
  created() {
    EventBus.$on("play-next-video", () => {
      // when it goes over the array
      if (this.current_video_index + 1 >= this.videos.length) {
        EventBus.$emit("stop-video");
      } else {
        ++this.current_video_index;
        const video = this.videos[this.current_video_index];
        EventBus.$emit("play-video", video);
      }
    });

    EventBus.$on("play-prev-video", () => {
      // when it goes over the array
      if (this.current_video_index === 0) {
        EventBus.$emit("stop-video");
      } else {
        --this.current_video_index;
        const video = this.videos[this.current_video_index];
        EventBus.$emit("play-video", video);
      }
    });
  },

  methods: {
    viewVideo(video, index) {
      EventBus.$emit("play-video", video);
      this.current_video_index = index;
    },

    async fetchVideos() {
      try {
        const response = await axios({
          method: "GET",
          url: `/api/video/feed/`,
        });

        this.videos = response.data;
        this.videos.forEach((video) => {
          this.video_ids.push(video.id);
        });

        if (this.video_ids.length !== 0) {
          await this.fetchThumbnails();
        }
      } catch (error) {
        this.error =
          "An error occurred during fetching video feed. Please try again.";
        console.error("Error:", error);
      }
    },

    async fetchThumbnails() {
      const formData = new FormData();
      formData.append("video_ids", this.video_ids);
      formData.append("bucket", "thumbnail");
      const response = await axios({
        method: "POST",
        url: `/api/video/get-url/`,
        data: formData,
      });
      this.video_thumbnails = response.data.urls;
    },
  },
};
</script>

<style>
/* Thank you, aj.Boonyanit */
.feed_container {
  display: grid;
  grid-template-columns: repeat(auto-fit, 400px);
  grid-gap: 5px;
  grid-auto-flow: row;
  justify-items: center;
  justify-content: center;
  padding: 2.5%;
}

.video_block {
  padding: 5px;
  margin-bottom: 10px;
}

.video_block img {
  height: 250px;
  width: 250px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
}

.video_block__text {
  padding-left: 15%;
  padding-top: 5px;
  text-align: left;
  max-width: 85%;
}

.video_block__text p,
.video_block__text h4 {
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>
