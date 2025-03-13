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
          name: 'Luftqualität',
          data: props.data.map((item) => item.airQuality),
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
        colors: ['#007bff'],
      }));
  
      return {
        series,
        chartOptions,
      };
    },
  });
  </script>
  