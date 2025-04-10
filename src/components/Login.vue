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
import { generateToken } from '../api.js'; // API-Import

export default {
  data() {
    return {
      username: '',
      password: '',
      loginError: false,
    };
  },
  methods: {
    async login() {
      try {
        // Wir rufen die API auf, um den Token zu generieren
        const response = await generateToken(this.username, this.password);

        // Erfolgreiche Anmeldung: Token im LocalStorage speichern
        if (response.token) {
          localStorage.setItem('authToken', response.token); // Token im LocalStorage speichern
          this.$emit('login-success'); // Erfolgreiche Anmeldung
          this.loginError = false;
          // Optional: Weiterleitung oder andere Aktionen nach erfolgreichem Login
        } else {
          throw new Error('Kein Token erhalten.');
        }
      } catch (error) {
        console.error('Login-Fehler:', error.message);
        this.loginError = true; // Fehleranzeige bei ungültigen Anmeldedaten
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
