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
              v-model="title"
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
              v-model="caption"
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
              v-model="file"
              required
              accept="video/*"
              placeholder="Choose a file or drop it here..."
            ></b-form-file>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-card>
    </b-container>
  </div>
</template>

<script>
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
    onSubmit() {
      // Handle form submission here
    },
  },
};
</script>
