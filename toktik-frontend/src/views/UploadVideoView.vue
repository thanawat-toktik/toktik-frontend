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
            description="Caption, a slightly longer short summary of what your video is about. No longer than 300 characters."
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
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
      // Create S3-compatible object storage instance
      const clientParams = {
        endpoint: process.env.VUE_APP_S3_RAW_ENDPOINT,
        region: process.env.VUE_APP_S3_REGION,
        credentials: {
          accessKeyId: process.env.VUE_APP_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.VUE_APP_S3_SECRET_ACCESS_KEY,
        },
      };
      const s3 = new S3Client(clientParams);

      // Upload file to S3-compatible object storage
      const fileName = `${Date.now()}-${this.form.file.name}`;
      const putObjectParams = {
        Bucket: process.env.VUE_APP_S3_BUCKET_NAME,
        Key: fileName,
        Body: this.form.file,
      };
      const result = await s3.send(new PutObjectCommand(putObjectParams));

      // Handle successful upload
      console.log(`File uploaded successfully: ${result.Buckets}`);
    },
  },
};
</script>
