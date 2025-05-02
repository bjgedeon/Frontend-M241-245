<script>
import { ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { fetchData } from "../api.js";
import TemperatureChart from "./Charts/TemperatureChart.vue";
import HumidityChart from "./Charts/HumidityChart.vue";
import AirQualityChart from "./Charts/AirQualityChart.vue";
import AirPressureChart from "./Charts/AirPressureChart.vue";
import Footer from "./Footer.vue";

export default {
  components: {
    TemperatureChart,
    HumidityChart,
    AirQualityChart,
    AirPressureChart,
    Footer,
  },

  setup() {
    const toast = useToast();

    const temperatureData = ref([]);
    const humidityData = ref([]);
    const airPressureData = ref([]);
    const airQualityData = ref([]);
    const latestData = ref({});
    const formattedTime = ref(new Date().toLocaleTimeString());
    const isDarkMode = ref(true);
    const selectedClient = ref(1.54);

    const toggleTheme = () => {
      const newTheme = isDarkMode.value ? "dark" : "light";
      document.body.classList.remove("dark", "light");
      document.body.classList.add(newTheme);
    };

    const getIcon = (type) => {
      return `/images/${type}-${isDarkMode.value ? "dark" : "light"}mode.png`;
    };

    const toastIds = {
      temperature: null,
      humidity: null,
      pressure: null,
      vocIndex: null,
    };

    const lastWarnedValues = {
      temperature: null,
      humidity: null,
      pressure: null,
      vocIndex: null,
    };

    const checkThresholds = (data) => {
      if (data.temperature < 0 || data.temperature > 30) {
        if (data.temperature !== lastWarnedValues.temperature) {
          if (toastIds.temperature) toast.dismiss(toastIds.temperature);
          toastIds.temperature = toast.warning(
            `Temperatur ausserhalb des Bereichs: ${data.temperature}°C`,
            { timeout: false }
          );
          lastWarnedValues.temperature = data.temperature;
        }
      } else if (toastIds.temperature) {
        toast.dismiss(toastIds.temperature);
        toastIds.temperature = null;
        lastWarnedValues.temperature = null;
      }

      if (data.humidity < 30 || data.humidity > 70) {
        if (data.humidity !== lastWarnedValues.humidity) {
          if (toastIds.humidity) toast.dismiss(toastIds.humidity);
          toastIds.humidity = toast.warning(
            `Luftfeuchtigkeit ausserhalb des Bereichs: ${data.humidity}%`,
            { timeout: false }
          );
          lastWarnedValues.humidity = data.humidity;
        }
      } else if (toastIds.humidity) {
        toast.dismiss(toastIds.humidity);
        toastIds.humidity = null;
        lastWarnedValues.humidity = null;
      }

      if (data.pressure < 980 || data.pressure > 1050) {
        if (data.pressure !== lastWarnedValues.pressure) {
          if (toastIds.pressure) toast.dismiss(toastIds.pressure);
          toastIds.pressure = toast.warning(
            `Luftdruck ausserhalb des Bereichs: ${data.pressure} hPa`,
            { timeout: false }
          );
          lastWarnedValues.pressure = data.pressure;
        }
      } else if (toastIds.pressure) {
        toast.dismiss(toastIds.pressure);
        toastIds.pressure = null;
        lastWarnedValues.pressure = null;
      }

      if (data.vocIndex > 200) {
        if (data.vocIndex !== lastWarnedValues.vocIndex) {
          if (toastIds.vocIndex) toast.dismiss(toastIds.vocIndex);
          toastIds.vocIndex = toast.warning(
            `Luftqualität schlecht: VOC-Index ${data.vocIndex}`,
            { timeout: false }
          );
          lastWarnedValues.vocIndex = data.vocIndex;
        }
      } else if (toastIds.vocIndex) {
        toast.dismiss(toastIds.vocIndex);
        toastIds.vocIndex = null;
        lastWarnedValues.vocIndex = null;
      }
    };

    const getData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("Kein Token im Speicher gefunden");

        const data = await fetchData(parseFloat(selectedClient.value), token);
        if (!data || data.length === 0) return;

        const latest = data[data.length - 1];
        latestData.value = latest;
        latestData.value.airQuality = latest.voc;

        const localTime = new Date(latest.timestamp);
        localTime.setHours(localTime.getHours() + 2);
        formattedTime.value = localTime.toLocaleTimeString();

        temperatureData.value.push({
          time: formattedTime.value,
          temperature: latest.temperature,
        });

        humidityData.value.push({
          time: formattedTime.value,
          humidity: latest.humidity,
        });

        airPressureData.value.push({
          time: formattedTime.value,
          pressure: latest.pressure,
        });

        airQualityData.value.push({
          time: formattedTime.value,
          airQuality: latest.voc,
        });

        checkThresholds(latest);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        toast.error("Fehler beim Abrufen der Daten");
      }
    };

    const updateCharts = () => {
      temperatureData.value = [...temperatureData.value];
      humidityData.value = [...humidityData.value];
      airQualityData.value = [...airQualityData.value];
      airPressureData.value = [...airPressureData.value];
    };

    onMounted(() => {
      document.body.classList.add("dark");
      getData();

      setInterval(() => {
        formattedTime.value = new Date().toLocaleTimeString();
        getData();
      }, 5000);

      setInterval(() => {
        updateCharts();
      }, 5000);
    });

    watch(selectedClient, () => {
      getData();
    });

    return {
      latestData,
      formattedTime,
      temperatureData,
      humidityData,
      airQualityData,
      airPressureData,
      toggleTheme,
      isDarkMode,
      selectedClient,
      getIcon,
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
        <h1>BBZW Sursee</h1>
        <p>{{ formattedTime }}</p>
      </div>

      <label class="toggle-switch">
        <input type="checkbox" v-model="isDarkMode" @change="toggleTheme" />
        <span class="slider">
          <span class="icon">{{ isDarkMode ? "🌙" : "☀️" }}</span>
        </span>
      </label>

      <label class="client-dropdown">
        <select v-model="selectedClient">
          <option :value="1.54">1.54</option>
          <option :value="1.61">1.61</option>
        </select>
      </label>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <div>
          <img
            :src="getIcon('temperatur')"
            alt="Temperatur"
            class="info-icon"
          />
          <p>
            Temperatur: {{ latestData?.temperature?.toFixed(1) || "N/A" }}°C
          </p>
        </div>
      </div>

      <div class="info-box">
        <div>
          <img
            :src="getIcon('luftfeuchtigkeit')"
            alt="Luftfeuchtigkeit"
            class="info-icon"
          />
          <p>
            Luftfeuchtigkeit: {{ latestData.humidity?.toFixed(1) || "N/A" }}%
          </p>
        </div>
      </div>

      <div class="info-box">
        <div>
          <img :src="getIcon('luftdruck')" alt="Luftdruck" class="info-icon" />
          <p>Luftdruck: {{ latestData.pressure?.toFixed(1) || "N/A" }} hPa</p>
        </div>
      </div>

      <div class="info-box">
        <div>
          <img
            :src="getIcon('luftqualitaet')"
            alt="Luftqualität"
            class="info-icon"
          />
          <p>Luftqualität: {{ latestData.airQuality?.toFixed(1) || "N/A" }}</p>
        </div>
      </div>
    </div>

    <div class="charts">
      <div class="chart">
        <TemperatureChart :data="temperatureData" :is-dark="isDarkMode" />
      </div>
      <div class="chart">
        <HumidityChart :data="humidityData" :is-dark="isDarkMode" />
      </div>
      <div class="chart">
        <AirPressureChart :data="airPressureData" :is-dark="isDarkMode" />
      </div>
      <div class="chart">
        <AirQualityChart :data="airQualityData" :is-dark="isDarkMode" />
      </div>
    </div>
  </div>
  <Footer :isDarkMode="isDarkMode" />

</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: auto;
}

body.dark {
  background-color: #1e1e1e;
  color: white;
}

body.light {
  background-color: #f8f9fa;
  color: black;
}

.dashboard {
  min-height: 100vh;
  box-sizing: border-box;
  margin-top: 80px;
  padding: 20px;
}

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
  position: relative;
  background-color: white;
  border-radius: 50px;
  width: 100%;
  height: 100%;
  transition: background-color 0.4s ease;
  overflow: hidden;
}

.toggle-switch input:checked + .slider {
  background-color: black;
}

.slider .icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  transition: left 0.4s ease, right 0.4s ease, color 0.4s;
  color: black;
  left: 8px;
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

.dark .header {
  background-color: #333;
}

.dark .info-box,
.dark .chart {
  background-color: #2c2c2c;
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
  grid-template-columns: 1fr 1fr;
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
  padding: 10px 14px;
  font-size: 16px;
  border-radius: 8px;
  background-color: var(--dropdown-bg, #fff);
  color: var(--dropdown-text, #000);
  border: 1px solid #ccc;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  outline: none;
  appearance: none;
  cursor: pointer;
}

/* Pfeil entfernen und durch eigenen ersetzen */

.client-dropdown::after {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #666;
}

body.dark .client-dropdown select {
  background-color: #444;
  color: #fff;
  border: 1px solid #666;
}

body.dark .client-dropdown::after {
  color: #aaa;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  font-family: sans-serif;
}

@media (max-width: 1024px) {
  .charts {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .charts {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

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
</style>
