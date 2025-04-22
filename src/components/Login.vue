<script>
import { ref } from "vue";
import { useRouter } from "vue-router"; // Router importieren
import { generateToken } from "../api.js"; // deine API-Methode

export default {
  setup() {
    const router = useRouter(); // Router Instanz
    const username = ref("");
    const password = ref("");
    const errorMessage = ref("");

    const login = async () => {
      try {
        const token = await generateToken(username.value, password.value);

        if (token) {
          localStorage.setItem("auth_token", token);
          router.push("/dashboard"); // Seite wechseln mit Vue Router
          
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
  gap: 15px;
  padding: 30px;
  border-radius: 8px;
  background-color: #2c2c2c;
  color: white;
}

input {
  padding: 10px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
}

button {
  padding: 10px;
  border: none;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: red;
}
</style>
