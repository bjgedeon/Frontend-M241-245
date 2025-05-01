<template>
  <div>
    <apexchart type="line" :options="chartOptions" :series="series" />
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
          name: 'Luftfeuchtigkeit',
          data: props.data.map((item) => item.humidity),
        },
      ]);
  
      const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    animations: {
      enabled: true,
    },
    foreColor: '#ccc',
    height: '100%',
    width: '100%',
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 250,
        },
      },
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 200,
        },
      },
    },
  ],
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    categories: props.data.map((item) => item.time),
  },
  colors: ['#007bff'], // oder #ff0000 / #00ff00 je nach Chart
}));
  
      return {
        series,
        chartOptions,
      };
    },
  });
  </script>
