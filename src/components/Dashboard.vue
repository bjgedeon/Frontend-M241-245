<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="header">
      <h1>Luzern</h1>
      <p>{{ formattedTime }}</p>
      <!-- Dark/Light Mode Toggle Button -->
      <button @click="toggleTheme">Toggle Dark/Light Mode</button>
    </div>

    <!-- Luftqualitäts-Infos -->
    <div class="info-box">
      <div>
        <p>🌡️ Temperatur: {{ latestData.temperature }}°C</p>
        <p>💧 Luftfeuchtigkeit: {{ latestData.humidity }}%</p>
      </div>
      <div>
        <p>📏 Luftdruck: {{ latestData.pressure }} hPa</p>
        <p>🌬️ Luftqualität: {{ latestData.airQuality }}</p>
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

    const toggleTheme = () => {
      const currentTheme = document.body.classList.contains("dark")
        ? "dark"
        : "light";
      document.body.classList.remove(currentTheme);
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.body.classList.add(newTheme);
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
      document.body.classList.add("dark"); // Standardmäßig Dark Mode setzen
      getData();
      setInterval(getData, 5000);
    });

    return {
      latestData,
      formattedTime,
      temperatureData,
      humidityData,
      pressureData,
      airQualityData,
      toggleTheme,
    };
  },
};
</script>

<style>
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
  width: 48%; /* Ensure space between columns */
}

.info-box p {
  margin: 5px 0;
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
