<script>
import { ref, onMounted } from "vue";
import { fetchData } from "../api.js";
import TemperatureChart from "./TemperatureChart.vue";
import HumidityChart from "./HumidityChart.vue";
import AirQualityChart from "./AirQualityChart.vue";

export default {
  components: { TemperatureChart, HumidityChart, AirQualityChart },

  setup() {
    const temperatureData = ref([]);
    const humidityData = ref([]);
    const pressureData = ref([]);
    const airQualityData = ref([]);
    const latestData = ref({});
    const formattedTime = ref(new Date().toLocaleTimeString());
    const currentTheme = ref("dark"); // Store current theme (dark or light)

    const toggleTheme = () => {
      // Toggle between dark and light modes
      currentTheme.value = currentTheme.value === "dark" ? "light" : "dark";
      const newTheme = currentTheme.value;
      document.body.classList.remove("dark", "light");
      document.body.classList.add(newTheme);
    };

    const getIcon = (type) => {
      // Dynamically return the correct icon based on the theme
      return `/images/${type}-${currentTheme.value}mode.png`;
    };

    const getData = async () => {
      try {
        const data = await fetchData();
        latestData.value = data;

        temperatureData.value.push({
          time: formattedTime.value,
          temperature: data.temperature,
        });
        humidityData.value.push({
          time: formattedTime.value,
          humidity: data.humidity,
        });
        pressureData.value.push({
          time: formattedTime.value,
          pressure: data.pressure,
        });
        airQualityData.value.push({
          time: formattedTime.value,
          airQuality: data.airQuality,
        });

        formattedTime.value = new Date().toLocaleTimeString();
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    };

    onMounted(() => {
      document.body.classList.add("light");
      getData();
      setInterval(() => {
        formattedTime.value = new Date().toLocaleTimeString(); // Uhrzeit wird alle 1 Sekunde aktualisiert
        getData();
      }, 1000);
    });

    return {
      latestData,
      formattedTime,
      temperatureData,
      humidityData,
      pressureData,
      airQualityData,
      toggleTheme,
      getIcon, // Provide the method for icon switching
    };
  },
};
</script>

<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="header">
      <h1>Luzern</h1>
      <p>{{ formattedTime }}</p>
      <button @click="toggleTheme">Toggle Dark/Light Mode</button>
    </div>

    <!-- Luftqualitäts-Infos -->
    <div class="info-box">
      <div>
        <img :src="getIcon('temperatur')" alt="Temperatur" class="info-icon" />
        <p>Temperatur: {{ latestData.temperature }}°C</p>
      </div>
      <div>
        <img
          :src="getIcon('luftfeuchtigkeit')"
          alt="Luftfeuchtigkeit"
          class="info-icon"
        />
        <p>Luftfeuchtigkeit: {{ latestData.humidity }}%</p>
      </div>
    </div>

    <div class="info-box">
      <div>
        <img :src="getIcon('luftdruck')" alt="Luftdruck" class="info-icon" />
        <p>Luftdruck: {{ latestData.pressure }} hPa</p>
      </div>
      <div>
        <img
          :src="getIcon('luftqualitaet')"
          alt="Luftqualität"
          class="info-icon"
        />
        <p>Luftqualität: {{ latestData.airQuality }}</p>
      </div>
    </div>

    <!-- Diagramme -->
    <div class="charts">
      <div class="chart">
        <TemperatureChart :data="temperatureData" />
      </div>
      <div class="chart">
        <HumidityChart :data="humidityData" />
      </div>
      <div class="chart">
        <AirQualityChart :data="airQualityData" />
      </div>
    </div>
  </div>
</template>

<style>
.info-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  vertical-align: middle;
}

.dashboard {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  transition: background-color 0.3s, color 0.3s;
  width: 100%;
  height: 100vh;
}

/* Dark Mode */
.dark {
  background-color: #1e1e1e;
  color: #fff;
}

.dark .header {
  background-color: #333;
}

.dark .info-box,
.dark .chart {
  background-color: #2c2c2c;
}

/* Global Styles */
body.dark {
  background-color: #1e1e1e;
  color: white;
}

body.light {
  background-color: #f8f9fa;
  color: black;
}

/* Light Mode */
.light {
  background-color: #f4f4f4;
  color: #333;
}

.light .header {
  background-color: #ddd;
  color: #111;
}

.light .info-box,
.light .chart {
  background-color: #fff;
  color: #111;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Header-Stile */
.header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0; /* Stellt sicher, dass der Header auch links beginnt */
  width: 100%;
  z-index: 1000;
  box-sizing: border-box; /* Wichtig, um die Breite korrekt zu berechnen */
}

.header h1 {
  font-size: 2rem;
  margin: 0;
}

button {
  padding: 10px;
  background-color: #4caf50;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
}

button:hover {
  background-color: #45a049;
}

/* Margin top to avoid overlap with fixed header */
.dashboard {
  margin-top: 80px;
  padding: 20px;
}

/* Info-Box */
.info-box {
  display: flex;
  justify-content: space-between;
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.info-box div {
  display: flex;
  align-items: center;  /* Ensure that the icon and text align properly */
  width: 48%; /* Ensure space between columns */
}

.info-box p {
  margin: 0; /* Remove margin from paragraph */
}

/* Diagramme */
.charts {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.chart {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  height: 100%;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .charts {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .charts {
    grid-template-columns: 1fr;
  }

  .info-box {
    flex-direction: column;
  }

  .info-box div {
    width: 100%;
  }

  .header {
    flex-direction: column;
    text-align: center;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  button {
    margin-top: 10px;
  }
}
</style>
