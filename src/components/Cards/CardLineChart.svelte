<script>
  import { onMount } from "svelte";
  // library that creates chart objects in page
  import Chart from "chart.js/auto";


  export let data;

  let chart;
  let ctx;

  let labels = [];
  let mask_value = [];
  let distance_value = [];

  $: if (chart){
      labels = [];
      mask_value = [];
      distance_value = [];
      for (let obj of data.total_customDays) {
        labels = [...labels, obj.date];
        mask_value = [...mask_value, obj.faceMask];
        distance_value = [...distance_value, obj.distance];
      }
      chart.data.labels = labels;
      chart.data.datasets[0].data = distance_value
      chart.data.datasets[1].data = mask_value
      chart.update()
		}

  // init chart
  onMount(async () => {
    var config = {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Distance",
            backgroundColor: "#2563eb",
            borderColor: "#2563eb",
            data: distance_value,
            fill: false
          },
          {
            label: "Mask",
            fill: false,
            backgroundColor: "#f43f5e",
            borderColor: "#f43f5e",
            data: mask_value
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Sales Charts",
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
      },
    };
    chart = new Chart(ctx, config);
  });
</script>

<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 rounded bg-blueGray-700"
>
  <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full max-w-full flex-grow flex-1">
        <h2 class="text-zinc-800 text-xl font-semibold">
          Change of Violation Cases over time
        </h2>
      </div>
    </div>
  </div>
  <div class="p-4 flex-auto">
    <!-- Chart -->
    <div class="relative h-350-px">
      <canvas id="line-chart" bind:this={ctx}></canvas>
    </div>
  </div>
</div>
