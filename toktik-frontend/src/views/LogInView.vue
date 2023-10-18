<template>
  <div>
    <b-container fluid="md">
      <b-card title="Log In">
        <b-form @submit.prevent="onSubmit">
          <!-- Email -->
          <b-form-group
            label="Email"
            label-for="email"
            label-cols="1"
            label-align="right"
            style="text-align: left"
          >
          <b-form-input
              id="email"
              v-model="email"
              required
              placeholder="Sample: helloworld@toktik.com"
              type="email"
            ></b-form-input>
        </b-form-group>

        <!-- Password -->
        <b-form-group
            label="Password"
            label-for="password"
            label-cols="1"
            label-align="right"
            style="text-align: left"
          >
            <b-form-input
              id="password"
              type="password"
              v-model="password"
              required
              placeholder="Type in your password"
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>

        </b-form>
        <p v-if="error" style="color: red;">{{ error }}</p>
      </b-card>
    </b-container>    
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async onSubmit() {
      try {
        console.log(this.email)
        console.log(this.password)
        const response = await fetch('http://localhost:8001/auth/jwt/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log( data )
        // Do something with the response data
      } catch (error) {
        this.error = 'An error occurred during login. Please try again.';
        console.error('Error:', error);
      }
    }
  }
};
</script>
