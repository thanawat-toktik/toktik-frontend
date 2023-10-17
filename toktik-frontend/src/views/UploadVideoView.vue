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
              required
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
            ></b-form-file>
          </b-form-group>

          <!-- <b-button type="submit" variant="secondary">Check</b-button> -->
          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { v4 } from "uuid";
export default {
  data() {
    return {
      form: {
        title: "",
        caption: "",
        file: null,
      },
    };
  },
  methods: {
    async onSubmit() {
      const s3ObjectName = v4();
      const presignedUrlFormData = new FormData();
      presignedUrlFormData.append("key", s3ObjectName);

      const response = await this.axios({
        method: "POST",
        url: `${process.env.VUE_APP_BACKEND_HOST}/video/upload-psurl/`,
        data: presignedUrlFormData,
      });

      const presignedUrl = await response.data.url;
      const result = this.axios({
        method: "PUT",
        url: presignedUrl,
        data: this.form.file,
        headers: {
          "x-amz-acl": "public-read",
        },
      });

      result.then(
        // eslint-disable-next-line no-unused-vars
        (response) => {
          console.log("Success!");
        },
        (errorResponse) => {
          console.error(errorResponse);
          return;
        }
      );

      const updateDBFormData = new FormData();
      updateDBFormData.append("title", this.form.title);
      updateDBFormData.append("caption", this.form.caption);
      updateDBFormData.append("s3_key", s3ObjectName);

      const updateDBResponse = await this.axios({
        method: "POST",
        url: `${process.env.VUE_APP_BACKEND_HOST}/video/update-db/`,
        data: updateDBFormData,
      });

      console.log(updateDBResponse);
    },
  },
};
</script>
