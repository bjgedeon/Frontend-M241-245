<!-- src/components/Login.vue -->
<template>
    <div class="login-container">
      <form @submit.prevent="login">
        <label for="username">Benutzername:</label>
        <input type="text" id="username" v-model="username" placeholder="Benutzername" required />
        
        <label for="password">Passwort:</label>
        <input type="password" id="password" v-model="password" placeholder="Passwort" required />
        
        <button type="submit">Anmelden</button>
        <p v-if="loginError" style="color: red;">Ungültiger Benutzername oder Passwort</p>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        loginError: false,
      };
    },
    methods: {
      login() {
        if (this.username === 'hans' && this.password === '1234') {
          this.$emit('login-success'); // Emit event when login is successful
          this.loginError = false;
        } else {
          this.loginError = true;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    width: 100%;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  label {
    margin-top: 10px;
  }
  
  input {
    margin-top: 5px;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  button {
    margin-top: 20px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  