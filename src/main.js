/**
 * Startet die Vue-Anwendung.
 *
 * Diese Datei importiert und konfiguriert die wesentlichen Komponenten der App:
 * - Erzeugt die Vue-Anwendung basierend auf der Hauptkomponente App.vue.
 * - Importiert und richtet den Router ein, um Navigation in der Anwendung zu ermöglichen.
 * - Fügt das Toast-Plugin hinzu, um Benachrichtigungen anzuzeigen.
 * - Montiert die Anwendung an das DOM-Element mit der ID "app".
 */

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Importiere das Toast-Plugin und die zugehörigen CSS-Stile
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Erstelle eine neue Vue-Anwendung aus der Hauptkomponente
const app = createApp(App);

// Konfigurationsoptionen fuer Toast-Benachrichtigungen
const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Verwende den Router und das Toast-Plugin in der Anwendung
app.use(router);
app.use(Toast, toastOptions);

// Montiere die Anwendung am DOM-Element mit der ID "app"
app.mount("#app");
