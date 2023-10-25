<template>
  <div>
    <b-container fluid="md">
      <b-card title="Video Upload">
        <b-form @submit.prevent="onSubmit">
          <b-form-group
            label="Title"
            label-for="title"
            label-cols="1"
            label-align="right"
            description="Title, a short summary of what your video is about. No longer than 50 characters."
            style="text-align: left"
          >
            <b-form-input
              id="title"
              v-model="form.title"
              required
              placeholder="Enter title"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Caption"
            label-for="caption"
            label-cols="1"
            label-align="right"
            description="Caption, a slightly longer short summary of what your video is about. No longer than 100 characters."
            style="text-align: left"
          >
            <b-form-input
              id="caption"
              v-model="form.caption"
              placeholder="Enter caption"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Video File"
            label-for="file"
            label-cols="1"
            label-align="right"
            style="text-align: left"
          >
            <b-form-file
              id="file"
              v-model="form.file"
              required
              accept="video/*"
              placeholder="Choose a file or drop it here..."
              @input="onInput"
            ></b-form-file>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-card>

      <b-modal
        v-model="showModal"
        title="Upload Status"
        hide-footer
        hide-header-close
      >
        <b-progress
          v-if="this.showProgress"
          :value="this.uploadProgress"
          :max="this.form.file.size"
          show-progress
          animated
        ></b-progress>
        <p>{{ modalMessage }}</p>
        <b-button
          @click="
            showModal = false;
            modalMessage = '';
          "
          block
          >Close
        </b-button>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import axios from '@/axios';
import { v4 } from "uuid";

export default {
  data() {
    return {
      form: {
        title: "",
        caption: "",
        file: null,
      },
      showModal: false,
      showProgress: false,
      modalMessage: "",
      videoLength: NaN,
      uploadProgress: 0,
    };
  },
  methods: {
    onInput() {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        this.videoLength = video.duration;
        URL.revokeObjectURL(video.src);
      };
      video.load();
      video.src = URL.createObjectURL(this.form.file);
    },
    async onSubmit() {
      if (this.videoLength > 60) {
        this.modalMessage =
          "Your video file is too long. Keep it under 60 seconds.";
        this.showModal = true;
        return;
      }

      const s3ObjectName = `${v4()}.${this.form.file.name.split(".").pop()}`;
      const presignedUrlFormData = new FormData();
      presignedUrlFormData.append("key", s3ObjectName);
      
      const response = await axios({
        method: "POST",
        url: `/api/video/upload-psurl/`,
        data: presignedUrlFormData,
      });

      const presignedUrl = response.data.url;
      this.showModal = true;
      const config = {
        onUploadProgress: (progressEvent) => {
          this.uploadProgress = progressEvent.loaded;
        },
        headers: {
          "x-amz-acl": "public-read",
          "Content-Type": "video/*",
          Authorization: "",
        },
      };

      this.showProgress = true;
      await axios.put(presignedUrl, this.form.file, config);
      this.showProgress = false;

      const updateDBFormData = new FormData();
      updateDBFormData.append("title", this.form.title);
      updateDBFormData.append("caption", this.form.caption);
      updateDBFormData.append("s3_key", s3ObjectName);

      const updateDBResponse = await axios({
        method: "POST",
        url: `/api/video/update-db/`,
        data: updateDBFormData,
      });

      if (updateDBResponse.status === 201) {
        this.modalMessage = "Upload successful.";
      } else {
        this.modalMessage = "Upload failed. Please try again.";
      }
    },
  },
};
</script>
