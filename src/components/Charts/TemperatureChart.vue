<template>
  <div class="chart-container">
    <apexchart type="line" :options="chartOptions" :series="series" />
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import VueApexCharts from "vue3-apexcharts";

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
        name: "Temperatur",
        data: props.data.map((item) => item.temperature),
      },
    ]);

    const chartOptions = computed(() => ({
      chart: {
        type: "line",
        zoom: { enabled: false },
        toolbar: { show: false },
        animations: { enabled: true },
        foreColor: "#ccc",
        height: "100%",
        width: "100%",
      },
      title: {
        text: "Temperatur",
        align: "center",
        style: {
          fontSize: "16px",
          color: "#ffffff",
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: { height: 250 },
            xaxis: {
              labels: { show: true, rotate: -45, style: { fontSize: "10px" } },
            },
            yaxis: { labels: { style: { fontSize: "10px" } } },
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: { height: 200 },
            xaxis: { labels: { rotate: -45, style: { fontSize: "9px" } } },
            yaxis: { labels: { style: { fontSize: "9px" } } },
          },
        },
      ],
      stroke: { curve: "smooth" },
      xaxis: {
        categories: props.data.map((item) => item.time),
        title: {
          text: "Zeit (vor wie lange)",
          style: {
            fontSize: "12px",
            color: "#ffffff",
          },
        },
        labels: { style: { fontSize: "12px" } },
      },
      yaxis: {
        title: {
          text: "Temperatur (°C)",
          style: {
            fontSize: "12px",
            color: "#ffffff",
          },
        },
        labels: { style: { fontSize: "12px" } },
      },
      colors: ["#007bff"],
    }));

    return {
      series,
      chartOptions,
    };
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 10px 0;
  }
}
</style>
