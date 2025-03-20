<template>
  <div class="auth-container">
    <h2>Registrieren</h2>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="E-Mail" required />
      <input
        v-model="password"
        type="password"
        placeholder="Passwort"
        required
      />
      <button type="submit">Registrieren</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");

const register = () => {
  console.log("Registrierung:", email.value, password.value);
  // Hier API-Call für die Registrierung einfügen
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
