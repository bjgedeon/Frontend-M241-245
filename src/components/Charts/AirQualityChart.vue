<template>
  <div class="chart-container">
    <apexchart type="radialBar" height="400" :options="chartOptions" :series="series" />
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
    isDark: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const latestValue = computed(() =>
      props.data.length > 0 ? props.data[props.data.length - 1].airQuality : 0
    );

    const series = computed(() => [latestValue.value]);

    const chartOptions = computed(() => {
      const textColor = props.isDark ? "#ffffff" : "#333333";
      const bgColor = props.isDark ? "#1e1e1e" : "#ffffff";

      return {
        chart: {
          type: "radialBar",
          height: 400,
          toolbar: { show: false },
          animations: { enabled: true },
          foreColor: textColor,
          background: bgColor,
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
              size: "65%",
            },
            track: {
              background: props.isDark ? "#333" : "#eee",
              strokeWidth: "100%",
            },
            dataLabels: {
              name: {
                show: true,
                fontSize: "20px",
                color: textColor,
                offsetY: -5,
              },
              value: {
                formatter: (val) => `${val.toFixed(1)} AQI`,
                fontSize: "28px",
                color: textColor,
                show: true,
                offsetY: 5,
              },
            },
          },
        },
        labels: ["Luftqualität"],
        colors: ["#28a745"],
        tooltip: {
          enabled: true,
          theme: props.isDark ? "dark" : "light",
        },
      };
    });

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
  max-width: 600px;
  margin: 0 auto;
}
</style>
