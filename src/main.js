import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Deine Router-Konfiguration importieren

createApp(App)
  .use(router)  // Vue Router aktivieren
  .mount('#app')
