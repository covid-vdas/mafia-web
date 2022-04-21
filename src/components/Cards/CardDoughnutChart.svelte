<script>
  import { onMount } from "svelte";
  // library that creates chart objects in page
  import Chart from "chart.js/auto";


  export let data;

  let chart;
  let ctx;

  $: if (chart){
      chart.data.datasets[0].data = [data.total_distance, data.total_facemask];
      chart.update();
		}

  // init chart
  onMount(async () => {
    let config = {
      type: "doughnut",
      data: {
        labels: [
          "Distance",
          "Mask",
          
        ],
        datasets: [
          {
            label: new Date().getFullYear(),
            backgroundColor: ["#2563eb",  "#f43f5e"],
            data: [data.total_distance, data.total_facemask],
            fill: false,
            barThickness: 8
          },
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Orders Chart",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        legend: {
          labels: {
            fontColor: "rgba(0,0,0,.4)",
          },
          align: "end",
          position: "bottom",
        },
      },
    };

    chart = new Chart(ctx, config);
  });
</script>

<div
  class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded"
>
  <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full max-w-full flex-grow flex-1">
        <h3 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
          Overview
        </h3>
        <h2 class="text-zinc-700 text-xl font-semibold">
          Share of Violation Types to Total Violation Cases
        </h2>
      </div>
    </div>
  </div>
  <div class="p-4 flex-auto">
    <div class="relative h-350-px">
      <canvas id="bar-chart" bind:this={ctx}></canvas>
    </div>
  </div>
</div>
