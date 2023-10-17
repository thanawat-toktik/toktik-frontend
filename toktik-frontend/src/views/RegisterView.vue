<template>
  <div>
    <b-container fluid="md">
      <b-card title="Register">
        <b-form @submit.prevent="onSubmit">
          <!-- Username -->
          <b-form-group
            label="Username"
            label-for="username"
            label-cols="1"
            label-align="right"
            style="text-align: left"
            description="Choose a unique username. No longer than 40 characters."
          >
            <b-form-input
                id="username"
                v-model="username"
                required
                placeholder="Sample: Toktik_69420"
              ></b-form-input>
          </b-form-group>

          <!-- Displayname -->
          <b-form-group
            label="Displayname"
            label-for="displayname"
            label-cols="1"
            label-align="right"
            style="text-align: left"
            description="Choose a name to be displayed on your account. No longer than 40 characters."
          >
            <b-form-input
                id="displayname"
                v-model="displayname"
                required
                placeholder="Sample: Mr.Toktiker"
              ></b-form-input>
          </b-form-group>

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
            description="Enter a valid Email"
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
      username: "",
      displayname: "",
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async onSubmit() {

      try {
        const response = await fetch('http://localhost:8001/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            displayname: this.displayname,
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
        this.error = 'An error occurred during registration. Please try again.';
        console.error('Error:', error);
      }
    }
  }
};
</script>
