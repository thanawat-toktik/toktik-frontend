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
          <b-card-body
            style="width: 90%; align-content: center; text-align: left"
          >
            <b-row>
              <b-col>
                <h1>{{ videoTitle }}</h1>
                <h5>
                  uploaded by <b>{{ videoOwner }}</b>
                </h5>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-button pill variant="light" @click="onLike">
                  <b-icon icon="heart" v-if="!this.isLiked"></b-icon>
                  <b-icon icon="heart-fill" v-else style="color: red"></b-icon>
                  Nice!
                </b-button>
                ({{ likeCount }} thinks so)
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <h5>Comments</h5>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="9">
                <b-form-textarea
                  id="textarea"
                  placeholder="What do you think?"
                  rows="3"
                  v-model="userComment"
                  no-resize
                >
                </b-form-textarea>
              </b-col>
              <b-col style="margin: auto" cols="3">
                <b-button block variant="white" @click="onComment">
                  <img
                    src="../assets/paper-plane.svg"
                    alt="Paper plane"
                    width="25"
                  />
                </b-button>
              </b-col>
            </b-row>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import { nextTick } from "vue";
import { EventBus } from "@/eventBus";
import VideoPlayer from "@/components/VideoPlayer.vue";
import axios from "@/axios";

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
      isLiked: false,
      likeCount: 0,
      userComment: "",
    };
  },
  async created() {
    EventBus.$on("play-video", async (video) => {
      this.isLiked = false;
      this.playOnce = false;
      this.showVideo = false;
      this.videoId = video.id;
      this.videoTitle = video.title;
      this.videoOwner = video.uploader.username;
      await this.fetchLike();

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
  destroyed() {
    EventBus.$off("play-video");
    EventBus.$off("play-video-once");
    EventBus.$off("stop-video");
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
    async fetchLike() {
      await axios
        .get("/api/video/like/", {
          withCredentials: true,
          params: { videoId: this.videoId },
        })
        .then((response) => {
          this.isLiked = response.data.isLiked;
          this.likeCount = response.data.likeCount;
        })
        .catch(() => {});
    },
    async onLike() {
      const response = await axios.post(
        "/api/video/like/",
        {
          video_id: this.videoId,
          isLiked: !this.isLiked,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        this.isLiked = !this.isLiked;
        this.likeCount = this.isLiked ? this.likeCount + 1 : this.likeCount - 1;
      }
    },
    async onComment() {
      if (this.comment === "") {
        return; // don't send empty comments
      }

      console.log(this.comment);
      const response = await axios.post(
          "/api/video/comment/",
          {
            video_id: this.videoId,
            content: this.userComment,
          },
          {
            withCredentials: true,
          }
      )
      console.log(response)
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
  padding: 0;
  margin: 0;
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
