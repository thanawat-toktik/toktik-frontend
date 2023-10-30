<template>
  <div>
    <div class="top">
      <h2>My Videos</h2>
    </div>
    <div class="background">
      <div class="container">
        <ul v-for="(video, index) in videos" :key="index" class="video-list">
          <li class="video-item">
              <div class="video-thumbnail">
                <img 
                  :src="video_thumbnails[index]"
                  @error="onImageError(index)"
                  alt="Thumbnail"
                  v-if="video.hasThumbnail"
                />
                <img 
                  src="../assets/no_thumbnail.png"
                  alt="Thumbnail"
                  v-else
                />
              </div>
              <hr>
              <div class="video-details">
                  <p class="video-title">{{ video.title }}</p>
                  <p class="video-description">{{ video.caption }}</p>
                  <p class="video-stats">Views: {{ video.view }}</p>
              </div>
              <div class=".video-process">
                <p>{{ progressText(video) }}</p>
              </div>
          </li>
        </ul>
      </div>
    </div>
      
  </div>
</template>

<script>
import axios from '@/axios';

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
  methods: {
    onImageError(index) {
      this.$set(this.video_thumbnails, index, '')
    },
    progressText(video) {
      let mainText = "";
      let subText = "";
      if ( video.status == "done" ) {
        return "Successfully Uploaded"
      } else if ( video.status == "failed" ) {
        mainText = "Failed to process video at step: "
      } else {
        mainText = "Processing video at step: "
      }

      if (!video.isConverted) {
        subText = "Video Conversion"
      } else if (!video.isChunked) {
        subText = "Video Chunking"
      } else {
        subText = "Extracting Thumbnail"
      }
      return mainText + subText
    },
    async fetchVideos() {
      try {
        const response = await axios({
          method: "GET",
          url: `/api/video/my-video/`,
        });

        this.videos = response.data;
        this.videos.forEach( async video => {
          await this.video_ids.push(video.id)
        })
        this.fetchThumbnails()
        
      } catch (error) {
        this.error = "An error occurred during fetching video feed. Please try again.";
        console.error("Error:", error);
      }
    },

    async fetchThumbnails() {
      const formData = new FormData();
      formData.append("video_ids", this.video_ids);
      formData.append("bucket", 'thumbnail');
      
      const response = await axios({
        method: "POST",
        url: `/api/video/get-url/`,
        data: formData
      });
      this.video_thumbnails = response.data.urls;
    },
    
  },
};
</script>

<style>
.top {
    margin-bottom: 20px;
    padding: 10px;
}
.background {
  background-color: #f6f6f6;
}
.container {
    max-width: 70%;
    padding: 10px;
}
.video-list {
    list-style-type: none;
    padding: 0;
}
.video-item {
    display: flex;
    text-align: left;
    align-items: center;
    margin: 2px;
}
.video-thumbnail {
  margin-right: 20px;
}
.video-thumbnail img {
  width: 160px;
  height: 90px;
  border-radius: 10px;
}
.video-details {
  flex: 1;
  margin: 10px;
}
.video-title {
  font-size: 18px;
  font-weight: bold;
  margin: 5px 0;
}
.video-description {
  color: #555;
}
.video-stats {
  color: #777;
}
.video-process {
  color: #777;
}
</style>
