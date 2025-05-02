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
    isDark: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const series = computed(() => [
      {
        name: "Luftqualität",
        data: props.data.map((item) => item.airQuality),
      },
    ]);

    const chartOptions = computed(() => {
      const textColor = props.isDark ? "#ffffff" : "#333333";
      const axisLabelColor = props.isDark ? "#cccccc" : "#444444";

      return {
        chart: {
          type: "line",
          zoom: { enabled: false },
          toolbar: { show: false },
          animations: { enabled: true },
          foreColor: textColor,
          height: "100%",
          width: "100%",
        },
        title: {
          text: "Luftqualität",
          align: "center",
          style: {
            fontSize: "16px",
            color: textColor,
          },
        },
        stroke: { curve: "smooth" },
        xaxis: {
          categories: props.data.map((item) => item.time),
          title: {
            text: "Zeit (vor wie lange)",
            style: {
              fontSize: "12px",
              color: textColor,
            },
          },
          labels: {
            style: {
              fontSize: "12px",
              color: axisLabelColor,
            },
          },
        },
        yaxis: {
          title: {
            text: "Luftqualität (Index)",
            style: {
              fontSize: "12px",
              color: textColor,
            },
          },
          labels: {
            style: {
              fontSize: "12px",
              color: axisLabelColor,
            },
          },
        },
        colors: ["#007bff"],
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: { height: 250 },
              xaxis: {
                labels: {
                  rotate: -45,
                  style: { fontSize: "10px", color: axisLabelColor },
                },
              },
              yaxis: {
                labels: { style: { fontSize: "10px", color: axisLabelColor } },
              },
            },
          },
          {
            breakpoint: 480,
            options: {
              chart: { height: 200 },
              xaxis: {
                labels: {
                  rotate: -45,
                  style: { fontSize: "9px", color: axisLabelColor },
                },
              },
              yaxis: {
                labels: { style: { fontSize: "9px", color: axisLabelColor } },
              },
            },
          },
        ],
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
  max-width: 100%;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 10px 0;
  }
}
</style>
