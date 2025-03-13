<template>
    <div class="dashboard">
      <!-- Header -->
      <div class="header">
        <h1>Luzern</h1>
        <p>{{ formattedTime }}</p>
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
  import { ref, onMounted } from 'vue';
  import { fetchData } from '../api.js';
  import TemperatureChart from './TemperatureChart.vue';
  import HumidityChart from './HumidityChart.vue';
  import AirQualityChart from './AirQualityChart.vue';
  
  export default {
    components: { TemperatureChart, HumidityChart, AirQualityChart },
  
    setup() {
      // State-Variablen
      const temperatureData = ref([]);
      const humidityData = ref([]);
      const pressureData = ref([]);
      const airQualityData = ref([]);
      const latestData = ref({});
      const formattedTime = ref(new Date().toLocaleTimeString());
  
      // Datenabruf mit `fetch`
      const getData = async () => {
        try {
          const data = await fetchData();
          latestData.value = data;
  
          // Historische Werte für Diagramme speichern
          temperatureData.value.push({ time: formattedTime.value, temperature: data.temperature });
          humidityData.value.push({ time: formattedTime.value, humidity: data.humidity });
          pressureData.value.push({ time: formattedTime.value, pressure: data.pressure });
          airQualityData.value.push({ time: formattedTime.value, airQuality: data.airQuality });
  
          // Zeit aktualisieren
          formattedTime.value = new Date().toLocaleTimeString();
        } catch (error) {
          console.error('Fehler beim Abrufen der Daten:', error);
        }
      };
  
      // Daten alle 5 Sekunden aktualisieren
      onMounted(() => {
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
      };
    },
  };
  </script>
  
  <style scoped>
  .dashboard {
    font-family: Arial, sans-serif;
    color: #fff;
    background-color: #1e1e1e;
    padding: 20px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .info-box {
    display: flex;
    justify-content: space-between;
    background-color: #2c2c2c;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  .chart {
    margin-top: 20px;
  }
  </style>
  