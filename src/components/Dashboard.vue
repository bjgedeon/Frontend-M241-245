<script>
import { ref, onMounted } from "vue";
import { fetchData } from "../api.js";
import TemperatureChart from "./Charts/TemperatureChart.vue";
import HumidityChart from "./Charts/HumidityChart.vue";
import AirQualityChart from "./Charts/AirQualityChart.vue";

export default {
  components: { TemperatureChart, HumidityChart, AirQualityChart },

  setup() {
    const temperatureData = ref([]);
    const humidityData = ref([]);
    const pressureData = ref([]);
    const airQualityData = ref([]);
    const latestData = ref({});
    const formattedTime = ref(new Date().toLocaleTimeString());
    const isDarkMode = ref(true);
    const selectedClient = ref("client1");

    const toggleTheme = () => {
      const newTheme = isDarkMode.value ? "dark" : "light";
      document.body.classList.remove("dark", "light");
      document.body.classList.add(newTheme);
    };

    const getIcon = (type) => {
      return `/images/${type}-${isDarkMode.value ? "dark" : "light"}mode.png`;
    };

    const getData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Kein Token im Speicher gefunden");
        }

        const data = await fetchData(selectedClient.value, token);
        if (!data || data.length === 0) return;

        const latest = data[data.length - 1];
        latestData.value = latest;

        formattedTime.value = new Date(latest.timestamp).toLocaleTimeString();

        temperatureData.value.push({
          time: formattedTime.value,
          temperature: latest.temperature,
        });

        humidityData.value.push({
          time: formattedTime.value,
          humidity: latest.humidity,
        });

        pressureData.value.push({
          time: formattedTime.value,
          pressure: latest.pressure,
        });

        airQualityData.value.push({
          time: formattedTime.value,
          airQuality: latest.voc,
        });
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    };

    const updateCharts = () => {
      temperatureData.value = [...temperatureData.value];
      humidityData.value = [...humidityData.value];
      airQualityData.value = [...airQualityData.value];
    };

    onMounted(() => {
      document.body.classList.add("dark");
      getData();

      setInterval(() => {
        formattedTime.value = new Date().toLocaleTimeString();
        getData();
      }, 1000);

      setInterval(() => {
        updateCharts();
      }, 300000);
    });

    return {
      latestData,
      formattedTime,
      temperatureData,
      humidityData,
      pressureData,
      airQualityData,
      toggleTheme,
      getIcon,
      isDarkMode,
      selectedClient,
    };
  },
};
</script>

<template>
  <br />
  <div class="dashboard">
    <div class="header">
      <img src="/logo.png" alt="Dashboard Logo" class="logo" />
      <div class="header-center">
        <h1>Luzern</h1>
        <p>{{ formattedTime }}</p>
      </div>

      <label class="toggle-switch">
        <input type="checkbox" v-model="isDarkMode" @change="toggleTheme" />
        <span class="slider">
          <span class="thumb">
            {{ isDarkMode ? "🌙" : "☀️" }}
          </span>
        </span>
      </label>

      <label class="client-dropdown">
        <select v-model="selectedClient">
          <option value="client1">Client 1</option>
          <option value="client2">Client 2</option>
        </select>
      </label>
    </div>

    <div class="info-box">
      <div>
        <img :src="getIcon('temperatur')" alt="Temperatur" class="info-icon" />
        <p>Temperatur: {{ latestData.temperature }}°C</p>
      </div>
    </div>

    <div class="info-box">
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
    </div>

    <div class="info-box">
      <div>
        <img
          :src="getIcon('luftqualitaet')"
          alt="Luftqualität"
          class="info-icon"
        />
        <p>Luftqualität: {{ latestData.airQuality }}</p>
      </div>
    </div>

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
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 50px;
}

.slider .thumb {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  color: black;
  font-size: 14px;
  border-radius: 50%;
  transition: transform 0.4s ease;
  z-index: 2;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:checked + .slider .thumb {
  transform: translateX(30px);
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:checked + .slider:before {
  transform: translateX(30px);
}

.icon {
  font-size: 18px;
  color: white;
}

.info-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  vertical-align: middle;
}

.logo {
  height: 50px;
  width: auto;
}

.dashboard {
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
}

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

body.dark {
  background-color: #1e1e1e;
  color: white;
}

body.light {
  background-color: #f8f9fa;
  color: black;
}

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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #333;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
  font-family: sans-serif;
}

.header-center {
  display: flex;
  flex-direction: column;
  text-align: center;
  flex-grow: 1;
}

.header h1 {
  font-size: 1.8rem;
  margin: 0;
}

.header p {
  font-size: 1rem;
  margin: 0;
}

.dashboard {
  margin-top: 80px;
  padding: 20px;
}

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
  align-items: center;
  width: 48%;
}

.info-box p {
  margin: 0;
}

.charts {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.chart {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.chart canvas {
  width: 100%;
  height: 300px;
}

.client-dropdown select {
  padding: 10px;
  margin-left: 10px;
  font-size: 16px;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid #ccc;
}

@media (max-width: 768px) {
  .client-dropdown,
  .toggle-switch {
    margin-top: 10px;
  }

  .info-box {
    flex-direction: column;
    padding: 15px;
  }

  .info-box div {
    width: 100%;
    margin-bottom: 10px;
  }

  .charts {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .chart canvas {
    height: 200px;
  }

  .logo {
    height: 40px;
  }

  .dashboard {
    padding: 10px;
  }

  .client-dropdown select {
    font-size: 14px;
    padding: 8px;
  }
}
/* 2 Charts nebeneinander bei mittelgroßen Bildschirmen */
@media (max-width: 1024px) {
  .charts {
    grid-template-columns: 1fr 1fr;
  }
}

/* 1 Chart pro Reihe bei kleinen Bildschirmen */
@media (max-width: 768px) {
  .charts {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

</style>
