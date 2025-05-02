<template>
  <footer :class="['footer', isDarkMode ? 'dark' : 'light']">
    <p>
      © {{ new Date().getFullYear() }} BBZW Sursee | Alle Rechte vorbehalten
    </p>
    <p>Entwickelt von deinem Entwicklungs-Team</p>
  </footer>
</template>

<script>
export default {
  props: {
    isDarkMode: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 20px;
  margin-top: 40px;
  border-top: 1px solid #ccc;
  font-size: 0.9rem;
  font-family: sans-serif;
}

.footer.dark {
  background-color: #1e1e1e;
  color: white;
  border-color: #444;
}

.footer.light {
  background-color: #f9f9f9;
  color: #333;
  border-color: #ddd;
}
</style>
