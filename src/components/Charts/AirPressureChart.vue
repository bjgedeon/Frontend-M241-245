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
        name: "Luftdruck",
        data: props.data.map((item) => item.pressure),
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
          height: "100%", // kein width hier
        },
        title: {
          text: "Luftdruck",
          align: "center",
          style: {
            fontSize: "16px",
            color: textColor,
          },
        },
        stroke: { curve: "smooth" },
        xaxis: {
          categories: props.data.map((item) => item.time),
          tickAmount: 10, // Steuert die X-Achsen-Skalierung
          title: {
            text: "Uhrzeit",
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
            text: "Luftdruck (hPa)",
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
        colors: ["#fff700"],
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: { height: 250 },
              xaxis: {
                tickAmount: 5,
                labels: {
                  rotate: -45,
                  style: { fontSize: "10px", color: axisLabelColor },
                },
              },
              yaxis: {
                title: {
                  text: "Luftdruck (hPa)", // Y-Achsentitel explizit setzen
                  style: {
                    fontSize: "10px",
                    color: textColor,
                  },
                },
                labels: { style: { fontSize: "10px", color: axisLabelColor } },
              },
            },
          },
          {
            breakpoint: 480,
            options: {
              chart: { height: 200 },
              xaxis: {
                tickAmount: 3,
                labels: {
                  rotate: -45,
                  style: { fontSize: "9px", color: axisLabelColor },
                },
              },
              yaxis: {
                title: {
                  text: "Luftdruck (hPa)", // Auch hier setzen
                  style: {
                    fontSize: "9px",
                    color: textColor,
                  },
                },
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
  max-width: 800px;
  margin: 0 auto;
}
</style>
