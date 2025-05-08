<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { generateToken } from "../api.js";

export default {
  setup() {
    const router = useRouter();
    const username = ref("");
    const password = ref("");
    const errorMessage = ref("");

    const login = async () => {
      try {
        const token = await generateToken(username.value, password.value);

        if (token) {
          localStorage.setItem("auth_token", token);
          router.push("/dashboard");
          
        } else {
          errorMessage.value = "Anmeldung fehlgeschlagen";
        }
      } catch (error) {
        errorMessage.value = "Anmeldung fehlgeschlagen \n Bitte überprüfe Benutzername und Passwort";
        console.error(error);
      }
    };

    return {
      username,
      password,
      errorMessage,
      login,
    };
  },
};
</script>


<template>
  <div class="login-page">
    <div class="login-container">
      <div class="branding">
        <img src="/logo.png" alt="Dashboard Logo" class="logo" />
        <span class="brand-text">Breeze</span>
      </div>
      <h2>Login</h2>
      <input v-model="username" type="text" placeholder="Benutzername" />
      <input v-model="password" type="password" placeholder="Passwort" />
      <button @click="login">Anmelden</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style>
/* Globale Reset-Regeln */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.branding {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.logo {
  max-width: 50px;
  height: auto;
}

.brand-text {
  font-size: 32px;
  font-weight: 600;
  color: white;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.login-container {
  width: 90%;
  max-width: 600px;
  margin: 80px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  border-radius: 12px;
  background-color: #1e1e1e;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url('/clouds.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

h2 {
  text-align: center;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 24px;
}

input {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #2a2a2a;
  color: white;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #87CEEB;
}

button {
  padding: 12px;
  background-color: #4c7caf;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #5bb0d1;
}

.error {
  color: #f46303;
  text-align: center;
}
</style>