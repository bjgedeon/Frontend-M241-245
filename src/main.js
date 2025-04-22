import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 👈 wichtig

const app = createApp(App);
app.use(router); // 👈 wichtig
app.mount("#app");
