import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Toastification importieren
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; // Styling

const app = createApp(App);

// Toastification konfigurieren (optional)
const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

app.use(router);
app.use(Toast, toastOptions); // Toast verwenden
app.mount("#app");
