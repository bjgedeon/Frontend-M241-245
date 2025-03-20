<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="E-Mail" required />
      <input
        v-model="password"
        type="password"
        placeholder="Passwort"
        required
      />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");

const login = () => {
  console.log("Login:", email.value, password.value);
  // Hier API-Call für den Login einfügen
};
</script>

<style scoped>
.auth-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
