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
          errorMessage.value = "Anmeldung fehlgeschlagen. Kein Token erhalten.";
        }
      } catch (error) {
        errorMessage.value = "Anmeldung fehlgeschlagen. Bitte überprüfe Benutzername und Passwort.";
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
  <div class="login-container">
    <h2>Login</h2>
    <input v-model="username" type="text" placeholder="Benutzername" />
    <input v-model="password" type="password" placeholder="Passwort" />
    <button @click="login">Anmelden</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
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
  border-color: #4caf50;
}

button {
  padding: 12px;
  background-color: #4caf50;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #29b941;
}

.error {
  color: #f46303;
  text-align: center;
}
</style>
