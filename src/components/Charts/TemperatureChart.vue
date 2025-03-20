<template>
    <div>
      <apexchart
        type="line"
        width="400"
        height="300"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </template>
  
  <script>
  import { defineComponent, computed } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
  
  export default defineComponent({
    components: {
      apexchart: VueApexCharts,
    },
    props: {
      data: {
        type: Array,
        required: true,
      },
    },
    setup(props) {
      const series = computed(() => [
        {
          name: 'Temperatur',
          data: props.data.map((item) => item.temperature),
        },
      ]);
  
      const chartOptions = computed(() => ({
        chart: {
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        xaxis: {
          categories: props.data.map((item) => item.time),
        },
        stroke: {
          curve: 'smooth',
        },
        colors: ['#ff0000'], // Rote Linie für Temperatur
      }));
  
      return {
        series,
        chartOptions,
      };
    },
  });
  </script>
  